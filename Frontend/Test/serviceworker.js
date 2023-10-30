// Hàm sẽ được gọi khi service worker được đăng ký
function onRegistered() {
  // Chạy hàm onContentScriptLoaded()
  onContentScriptLoaded();
}

// Đăng ký hàm onRegistered() để chạy khi service worker được đăng ký
self.addEventListener("install", onRegistered);
