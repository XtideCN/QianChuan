// 语言检测和自动跳转逻辑
document.addEventListener('DOMContentLoaded', function() {
  // 检查 URL 参数，看是否是手动切换
  const urlParams = new URLSearchParams(window.location.search);
  const manualSwitch = urlParams.get('lang');
  
  if (manualSwitch) {
    // 如果是手动切换，保存偏好并移除参数
    localStorage.setItem('preferredLanguage', manualSwitch);
    
    // 清理 URL 参数
    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
    return;
  }
  
  // 检查是否已经设置过语言偏好
  const userPreferredLang = localStorage.getItem('preferredLanguage');
  
  // 如果有用户偏好，直接使用偏好（不自动跳转）
  if (userPreferredLang) {
    return;
  }
  
  // 没有用户偏好时，才检测浏览器语言
  const browserLang = navigator.language || navigator.userLanguage;
  const isChinese = browserLang.startsWith('zh');
  
  // 检查当前页面
  const currentPage = window.location.pathname;
  const isZhPage = currentPage.includes('index.zh.html');
  
  // 自动跳转逻辑（仅在第一次访问时执行）
  // 默认英文为主要版本
  if (isChinese && !isZhPage) {
    // 中文环境，不在中文页面 -> 跳转到中文页面
    window.location.href = 'index.zh.html';
  } else if (!isChinese && isZhPage) {
    // 非中文环境，在中文页面 -> 跳转到英文页面（默认）
    window.location.href = 'index.html';
  }
});

// 语言切换事件（保存用户偏好）
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('lang-switch')) {
    e.preventDefault();
    
    const targetPage = e.target.getAttribute('href');
    const lang = targetPage.includes('index.zh.html') ? 'zh' : 'en';
    
    // 保存用户偏好
    localStorage.setItem('preferredLanguage', lang);
    
    // 跳转到目标页面，添加参数防止自动跳转
    window.location.href = targetPage + '?lang=' + lang;
  }
});
