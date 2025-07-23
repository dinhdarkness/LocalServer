class DirectoryTreeViewer {
    constructor() {
        this.treeData = null;
        this.stats = {
            folders: 0,
            files: 0,
            totalSize: 0
        };
        this.selectedItem = null;
        this.selectedElement = null; // Thêm biến để lưu element được chọn
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadTreeData();
    }

    bindEvents() {
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.loadTreeData();
        });

        document.getElementById('expandAllBtn').addEventListener('click', () => {
            this.expandAll();
        });

        document.getElementById('collapseAllBtn').addEventListener('click', () => {
            this.collapseAll();
        });

        // Modal events
        document.getElementById('newFolderBtn').addEventListener('click', () => {
            this.showModal('newFolderModal');
        });

        document.getElementById('uploadFileBtn').addEventListener('click', () => {
            this.showModal('uploadModal');
        });

        // Close modal events
        document.querySelectorAll('.close, .close-modal').forEach(element => {
            element.addEventListener('click', () => {
                this.hideAllModals();
            });
        });

        // Modal backdrop click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideAllModals();
                }
            });
        });

        // Create folder
        document.getElementById('createFolderBtn').addEventListener('click', () => {
            this.createFolder();
        });

        // Upload file
        document.getElementById('uploadBtn').addEventListener('click', () => {
            this.uploadFiles();
        });

        // File input change
        document.getElementById('fileInput').addEventListener('change', (e) => {
            this.updateFileList(e.target.files);
        });



        // Rename
        document.getElementById('renameBtn').addEventListener('click', () => {
            this.renameItem();
        });

        // Context menu
        document.addEventListener('click', (e) => {
            this.hideContextMenu();
            
            // Bỏ chọn item khi click ra ngoài tree
            if (!e.target.closest('.tree-item') && !e.target.closest('.selected-info')) {
                this.deselectItem();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideAllModals();
                this.hideContextMenu();
            }
        });
    }

    async loadTreeData() {
        this.showLoading();
        this.hideError();
        this.hideTree();
        this.hideStats();

        try {
            const response = await fetch('/api/tree');
            const result = await response.json();

            if (result.success) {
                this.treeData = result.data;
                this.updateInfo();
                this.renderTree();
                this.calculateStats();
                this.updateStats();
                this.showTree();
                this.showStats();
            } else {
                throw new Error(result.error || 'Không thể tải dữ liệu');
            }
        } catch (error) {
            console.error('Error loading tree data:', error);
            this.showError(error.message);
        } finally {
            this.hideLoading();
        }
    }

    updateInfo() {
        document.getElementById('rootPath').textContent = this.treeData.root;
        document.getElementById('lastUpdate').textContent = new Date().toLocaleString('vi-VN');
    }

    renderTree() {
        const treeContainer = document.getElementById('tree');
        treeContainer.innerHTML = '';

        if (this.treeData.items.length === 0) {
            treeContainer.innerHTML = '<div class="tree-item"><i class="fas fa-info-circle"></i> Thư mục trống</div>';
            return;
        }

        this.treeData.items.forEach(item => {
            const itemElement = this.createTreeItem(item);
            treeContainer.appendChild(itemElement);
        });
    }

    createTreeItem(item) {
        const itemDiv = document.createElement('div');
        itemDiv.className = `tree-item ${item.type}`;
        itemDiv.dataset.path = item.path; // Thêm data attribute để lưu path
        
        const icon = item.type === 'directory' ? 'fas fa-folder' : 'fas fa-file';
        const sizeText = item.type === 'file' ? this.formatFileSize(item.size) : '';
        
        itemDiv.innerHTML = `
            <i class="${icon}"></i>
            <span class="name">${this.escapeHtml(item.name)}</span>
            ${sizeText ? `<span class="size">${sizeText}</span>` : ''}
        `;

        // Thêm sự kiện click để chọn item
        itemDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectItem(item, itemDiv);
        });

        if (item.type === 'directory' && item.children && item.children.length > 0) {
            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'tree-children';
            childrenContainer.style.display = 'none';

            item.children.forEach(child => {
                const childElement = this.createTreeItem(child);
                childrenContainer.appendChild(childElement);
            });

            itemDiv.appendChild(childrenContainer);

            // Thêm sự kiện double click để mở/đóng thư mục
            itemDiv.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                this.toggleDirectory(itemDiv, childrenContainer);
            });

            // Thay đổi icon khi mở/đóng
            const iconElement = itemDiv.querySelector('i');
            itemDiv.addEventListener('dblclick', () => {
                if (childrenContainer.style.display === 'none') {
                    iconElement.className = 'fas fa-folder-open';
                } else {
                    iconElement.className = 'fas fa-folder';
                }
            });
        }

        // Thêm context menu cho tất cả items
        itemDiv.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showContextMenu(e, item);
        });

        return itemDiv;
    }

    toggleDirectory(itemDiv, childrenContainer) {
        const isHidden = childrenContainer.style.display === 'none';
        childrenContainer.style.display = isHidden ? 'block' : 'none';
    }

    expandAll() {
        const children = document.querySelectorAll('.tree-children');
        children.forEach(child => {
            child.style.display = 'block';
        });

        // Cập nhật icon cho tất cả thư mục
        const folderIcons = document.querySelectorAll('.tree-item.directory i');
        folderIcons.forEach(icon => {
            icon.className = 'fas fa-folder-open';
        });
    }

    collapseAll() {
        const children = document.querySelectorAll('.tree-children');
        children.forEach(child => {
            child.style.display = 'none';
        });

        // Cập nhật icon cho tất cả thư mục
        const folderIcons = document.querySelectorAll('.tree-item.directory i');
        folderIcons.forEach(icon => {
            icon.className = 'fas fa-folder';
        });
    }

    calculateStats() {
        this.stats = {
            folders: 0,
            files: 0,
            totalSize: 0
        };

        this.countItems(this.treeData.items);
    }

    countItems(items) {
        items.forEach(item => {
            if (item.type === 'directory') {
                this.stats.folders++;
                if (item.children) {
                    this.countItems(item.children);
                }
            } else {
                this.stats.files++;
                this.stats.totalSize += item.size || 0;
            }
        });
    }

    updateStats() {
        document.getElementById('folderCount').textContent = this.stats.folders;
        document.getElementById('fileCount').textContent = this.stats.files;
        document.getElementById('totalSize').textContent = this.formatFileSize(this.stats.totalSize);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showLoading() {
        document.getElementById('loading').style.display = 'block';
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    showError(message) {
        document.getElementById('errorMessage').textContent = message;
        document.getElementById('error').style.display = 'block';
    }

    hideError() {
        document.getElementById('error').style.display = 'none';
    }

    showTree() {
        document.getElementById('treeContainer').style.display = 'block';
    }

    hideTree() {
        document.getElementById('treeContainer').style.display = 'none';
    }

    showStats() {
        document.getElementById('stats').style.display = 'flex';
    }

    hideStats() {
        document.getElementById('stats').style.display = 'none';
    }

    // Modal methods
    showModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
    }

    hideAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    // Create folder
    async createFolder() {
        const folderPath = document.getElementById('folderPath').value.trim();
        const folderName = document.getElementById('folderName').value.trim();

        if (!folderName) {
            this.showToast('Vui lòng nhập tên thư mục', 'error');
            return;
        }

        try {
            const response = await fetch('/api/folder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    folderPath: folderPath,
                    folderName: folderName
                })
            });

            const result = await response.json();

            if (result.success) {
                this.showToast('Thư mục đã được tạo thành công', 'success');
                this.hideAllModals();
                this.loadTreeData();
                document.getElementById('folderPath').value = '';
                document.getElementById('folderName').value = '';
            } else {
                this.showToast(result.error, 'error');
            }
        } catch (error) {
            this.showToast('Có lỗi xảy ra khi tạo thư mục', 'error');
        }
    }

    // Upload files
    async uploadFiles() {
        const fileInput = document.getElementById('fileInput');
        const uploadPath = document.getElementById('uploadPath').value.trim();

        if (!fileInput.files || fileInput.files.length === 0) {
            this.showToast('Vui lòng chọn file để upload', 'error');
            return;
        }

        let successCount = 0;
        let errorCount = 0;

        for (const file of files) {
            try {
                const formData = new FormData();
                formData.append('uploadPath', uploadPath);
                formData.append('file', file);

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success) {
                    successCount++;
                } else {
                    errorCount++;
                    console.error(`Upload failed for ${file.name}:`, result.error);
                }
            } catch (error) {
                errorCount++;
                console.error(`Upload error for ${file.name}:`, error);
            }
        }

        // Hiển thị kết quả
        if (successCount > 0 && errorCount === 0) {
            this.showToast(`${successCount} file đã được upload thành công`, 'success');
        } else if (successCount > 0 && errorCount > 0) {
            this.showToast(`${successCount} file thành công, ${errorCount} file thất bại`, 'info');
        } else {
            this.showToast('Không có file nào được upload thành công', 'error');
        }

        // Reset form và reload tree
        this.hideAllModals();
        this.loadTreeData();
        fileInput.value = '';
        document.getElementById('uploadPath').value = '';
        document.getElementById('fileList').innerHTML = '';
    }



    // Update file list
    updateFileList(files) {
        const fileList = document.getElementById('fileList');
        fileList.innerHTML = '';

        Array.from(files).forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <i class="fas fa-file"></i>
                <span class="file-name">${file.name}</span>
                <span class="file-size">${this.formatFileSize(file.size)}</span>
            `;
            fileList.appendChild(fileItem);
        });
    }

    // Rename item
    async renameItem() {
        if (!this.selectedItem) {
            this.showToast('Vui lòng chọn item để đổi tên', 'error');
            return;
        }

        const newName = document.getElementById('newName').value.trim();

        if (!newName) {
            this.showToast('Vui lòng nhập tên mới', 'error');
            return;
        }

        try {
            const response = await fetch('/api/rename', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    oldPath: this.selectedItem.path,
                    newName: newName
                })
            });

            const result = await response.json();

            if (result.success) {
                this.showToast('Đổi tên thành công', 'success');
                this.hideAllModals();
                this.loadTreeData();
                document.getElementById('newName').value = '';
                this.selectedItem = null;
            } else {
                this.showToast(result.error, 'error');
            }
        } catch (error) {
            this.showToast('Có lỗi xảy ra khi đổi tên', 'error');
        }
    }

    // Context menu
    showContextMenu(e, item) {
        this.selectedItem = item;
        this.hideContextMenu();

        const contextMenu = document.createElement('div');
        contextMenu.className = 'context-menu';
        contextMenu.style.left = e.pageX + 'px';
        contextMenu.style.top = e.pageY + 'px';

        // Tạo menu items
        const renameItem = document.createElement('div');
        renameItem.className = 'context-menu-item';
        renameItem.innerHTML = '<i class="fas fa-edit"></i> Đổi tên';
        renameItem.addEventListener('click', () => {
            this.renameItemFromContext();
        });

        contextMenu.appendChild(renameItem);

        // Thêm upload option cho thư mục
        if (item.type === 'directory') {
            const uploadItem = document.createElement('div');
            uploadItem.className = 'context-menu-item';
            uploadItem.innerHTML = '<i class="fas fa-upload"></i> Upload vào thư mục này';
            uploadItem.addEventListener('click', () => {
                this.uploadToFolder();
            });
            contextMenu.appendChild(uploadItem);
        }

        document.body.appendChild(contextMenu);
        contextMenu.style.display = 'block';
    }

    hideContextMenu() {
        const contextMenu = document.querySelector('.context-menu');
        if (contextMenu) {
            contextMenu.remove();
        }
    }

    renameItemFromContext() {
        document.getElementById('newName').value = this.selectedItem.name;
        this.showModal('renameModal');
    }

    uploadToFolder() {
        document.getElementById('uploadPath').value = this.selectedItem.path;
        this.showModal('uploadModal');
    }



    // Toast notification
    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Thêm method để chọn item
    selectItem(item, element) {
        // Bỏ chọn item trước đó
        if (this.selectedElement) {
            this.selectedElement.classList.remove('selected');
        }

        // Chọn item mới
        this.selectedItem = item;
        this.selectedElement = element;
        element.classList.add('selected');

        // Cập nhật thông tin item được chọn
        this.updateSelectedItemInfo();
    }

    // Thêm method để bỏ chọn item
    deselectItem() {
        if (this.selectedElement) {
            this.selectedElement.classList.remove('selected');
        }
        this.selectedItem = null;
        this.selectedElement = null;
        this.updateSelectedItemInfo();
    }

    // Thêm method để cập nhật thông tin item được chọn
    updateSelectedItemInfo() {
        const selectedInfo = document.getElementById('selectedInfo');
        if (!selectedInfo) return;

        if (this.selectedItem) {
            const item = this.selectedItem;
            const typeText = item.type === 'directory' ? 'Thư mục' : 'File';
            const sizeText = item.type === 'file' ? ` | Kích thước: ${this.formatFileSize(item.size)}` : '';
            
            const selectedContent = selectedInfo.querySelector('.selected-content');
            selectedContent.innerHTML = `
                <div class="selected-item-info">
                    <i class="fas ${item.type === 'directory' ? 'fa-folder' : 'fa-file'}"></i>
                    <span class="selected-name">${this.escapeHtml(item.name)}</span>
                    <span class="selected-type">(${typeText})${sizeText}</span>
                </div>
                <div class="selected-path">${this.escapeHtml(item.path)}</div>
            `;
            selectedInfo.style.display = 'block';
        } else {
            selectedInfo.style.display = 'none';
        }
    }
}

// Khởi tạo ứng dụng khi trang đã tải xong
document.addEventListener('DOMContentLoaded', () => {
    new DirectoryTreeViewer();
}); 