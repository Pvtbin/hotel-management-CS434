/**
 * SkyLight Hotel - Hệ thống xử lý tương tác toàn cục
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Tự động kiểm tra tính hợp lệ của Form (Đăng nhập / Đăng ký)
    const authForms = document.querySelectorAll("form");
    authForms.forEach(form => {
        form.addEventListener("submit", (e) => {
            e.preventDefault(); // Ngăn chặn tải lại trang thử nghiệm
            
            const inputs = form.querySelectorAll("input[required]");
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add("border-red-500", "focus:ring-red-500");
                } else {
                    input.classList.remove("border-red-500", "focus:ring-red-500");
                }
            });

            if (isValid) {
                alert("Xử lý dữ liệu thành công! Hệ thống đang chuyển hướng...");
            } else {
                alert("Vui lòng điền đầy đủ các trường thông tin bắt buộc.");
            }
        });
    });

    // 2. Logic xử lý ngày đặt phòng mặc định (Dành cho booking.html)
    const dateInputs = document.querySelectorAll('input[type="text"]');
    dateInputs.forEach(input => {
        // Tạo hiệu ứng focus bóng bẩy hơn cho ô nhập liệu dạng lịch
        input.addEventListener("focus", () => {
            input.closest('.flex-1').classList.add("border-primary", "ring-2", "ring-primary/20");
        });
        input.addEventListener("blur", () => {
            input.closest('.flex-1').classList.remove("border-primary", "ring-2", "ring-primary/20");
        });
    });

    // 3. Hiệu ứng đổi màu thanh điều hướng (Navbar) khi cuộn trang ở index.html
    const navbar = document.querySelector("nav");
    if (navbar) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                navbar.classList.add("shadow-md", "bg-white");
                navbar.classList.remove("bg-white/80");
            } else {
                navbar.classList.remove("shadow-md", "bg-white");
                navbar.classList.add("bg-white/80");
            }
        });
    }
});