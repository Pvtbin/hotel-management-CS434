/**
 * Hàm chuyển đổi tab nội dung động (Single Page Application thu nhỏ)
 * @param {string} tabName - Tên của tab muốn hiển thị (Ví dụ: 'rooms', 'payment', 'profile')
 */
function switchTab(tabName) {
    
    // Bước 1: Tìm tất cả các phần tử có class '.tab-content' và xóa class 'active' để ẩn chúng đi
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Bước 2: Tìm thẻ div chứa ID tương ứng (ví dụ: 'rooms-page') và thêm class 'active' để hiển thị lên
    const activeTab = document.getElementById(`${tabName}-page`);
    if (activeTab) {
        activeTab.classList.add('active');
    }

    // Bước 3: Đặt lại giao diện trạng thái cho thanh Menu điều hướng (Gỡ các màu nổi bật của tab cũ)
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('text-blue-600', 'font-semibold', 'border-b-2', 'border-blue-600', 'pb-1');
        btn.classList.add('text-gray-600');
    });

    // Bước 4: Tự động cuộn trang lên trên cùng (Top) một cách mượt mà khi người dùng bấm chuyển tab
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
// --- DÁN TIẾP VÀO DƯỚI CÙNG FILE APP.JS ĐOẠN NÀY ---

/**
 * 1. Hàm tự động cập nhật ngày nhận phòng khi chọn lịch xong
 */
function updateCheckinDate(dateValue) {
    if (!dateValue) return;
    
    // Đổi định dạng từ YYYY-MM-DD sang DD/MM/YYYY
    const [year, month, day] = dateValue.split('-');
    const formattedDate = `${day}/${month}/${year}`;
    
    const displayDate = document.getElementById('checkin-display-text');
    displayDate.innerText = formattedDate;
    displayDate.classList.remove('text-gray-400'); // Xóa màu xám mờ để chữ đậm lên
}

/**
 * 2. Hàm ẩn/hiện bảng chọn số khách khi bấm nút
 */
function toggleGuestDropdown(event) {
    event.stopPropagation(); // Ngăn sự kiện click bị lan ra ngoài
    const dropdown = document.getElementById('guest-dropdown');
    dropdown.classList.toggle('hidden');
}

/**
 * 3. Hàm tăng giảm số lượng người lớn / trẻ em
 */
function changeGuest(type, amount, event) {
    event.stopPropagation(); // Ngăn đóng dropdown khi bấm nút +/-
    
    const adultSpan = document.getElementById('adult-count');
    const childSpan = document.getElementById('child-count');
    const displaySpan = document.getElementById('guest-display-text');
    
    let currentAdult = parseInt(adultSpan.innerText);
    let currentChild = parseInt(childSpan.innerText);
    
    if (type === 'adult') {
        currentAdult += amount;
        if (currentAdult < 0) currentAdult = 0; // Thấp nhất là 0 người
        adultSpan.innerText = currentAdult;
    } else if (type === 'child') {
        currentChild += amount;
        if (currentChild < 0) currentChild = 0;
        childSpan.innerText = currentChild;
    }
    
    // Nếu cả 2 đều bằng 0 thì hiện chữ "Chưa chọn khách" màu xám
    if (currentAdult === 0 && currentChild === 0) {
        displaySpan.innerText = "Chưa chọn khách";
        displaySpan.classList.add('text-gray-400');
    } else {
        displaySpan.innerText = `${currentAdult} người lớn, ${currentChild} trẻ em`;
        displaySpan.classList.remove('text-gray-400'); // Làm đậm chữ khi đã chọn
    }
}

/**
 * 4. Tự động đóng bảng chọn khách khi bấm chuột ra ngoài menu
 */
document.addEventListener('click', (event) => {
    const dropdown = document.getElementById('guest-dropdown');
    const guestBtn = document.getElementById('guest-btn');
    
    if (dropdown && !dropdown.classList.contains('hidden') && !guestBtn.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.classList.add('hidden');
    }
});
// --- DÁN THÊM VÀO DƯỚI CÙNG ĐỂ XỬ LÝ CHỨC NĂNG VIẾT ĐÁNH GIÁ ---

/**
 * 5. Hàm ẩn/hiện form nhập đánh giá khi bấm nút "Viết đánh giá" hoặc "Hủy"
 */
function toggleReviewForm(event) {
    if (event) event.preventDefault();
    const formContainer = document.getElementById('review-form-container');
    if (formContainer) {
        formContainer.classList.toggle('hidden');
    }
}

/**
 * 6. Hàm xử lý khi người dùng nhấn nút "Gửi đánh giá"
 */
function submitReview() {
    const nameInput = document.getElementById('review-name');
    const contentInput = document.getElementById('review-content');
    const reviewsList = document.getElementById('reviews-list');

    // Lấy giá trị nhập vào và loại bỏ khoảng trắng thừa
    const name = nameInput.value.trim();
    const content = contentInput.value.trim();

    // Kiểm tra nếu để trống thì báo lỗi
    if (!name || !content) {
        alert('Vui lòng nhập đầy đủ Họ tên và Nội dung đánh giá!');
        return;
    }

    // Tự động lấy tháng và năm hiện tại (Ví dụ: THÁNG 6 NĂM 2026)
    const now = new Date();
    const currentMonthYear = `THÁNG ${now.getMonth() + 1} NĂM ${now.getFullYear()}`;

    // Tạo đoạn code HTML cho bình luận mới
    const newReviewHTML = `
        <div class="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm">
            <div class="flex justify-between font-semibold mb-1">
                <span>${name}</span>
                <span class="text-xs text-gray-400 uppercase">${currentMonthYear}</span>
            </div>
            <p class="text-gray-600 italic">"${content}"</p>
        </div>
    `;

    // Chèn bình luận mới này lên trên cùng của danh sách
    reviewsList.insertAdjacentHTML('afterbegin', newReviewHTML);

    // Xóa sạch chữ trong ô nhập để người dùng có thể nhập bài mới
    nameInput.value = '';
    contentInput.value = '';

    // Tự động ẩn form đi sau khi gửi thành công
    toggleReviewForm();
}