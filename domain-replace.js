(function() {
  // 域名配置
  const CONFIG = {
    originalDomain: 'xtide.cn',
    newDomain: 'elite-media.us',
    originalBrand: 'xtide',
    newBrand: 'elite-media',
    originalEmailDomain: 'xtide.cn',
    newEmailDomain: 'elite-media.us'
  };

  // 获取当前域名（不区分大小写）
  const currentHost = window.location.hostname.toLowerCase();

  // 判断是否需要替换
  function shouldReplace() {
    return currentHost.includes(CONFIG.newDomain.split('.')[0]) || 
           currentHost === CONFIG.newDomain;
  }

  // 文本替换函数，优先处理完整的域名
  function replaceText(text) {
    let result = text;
    
    // 优先替换完整的邮箱域名和网站域名
    result = result.replace(
      new RegExp(CONFIG.originalEmailDomain.replace('.', '\\.'), 'gi'),
      CONFIG.newEmailDomain
    );
    
    result = result.replace(
      new RegExp(CONFIG.originalDomain.replace('.', '\\.'), 'gi'),
      CONFIG.newDomain
    );
    
    // 然后替换品牌名
    result = result.replace(
      new RegExp(CONFIG.originalBrand, 'gi'),
      CONFIG.newBrand
    );
    
    return result;
  }

  // 替换文本内容（不区分大小写的正则表达式）
  function replaceTextInNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const originalText = node.nodeValue;
      const newText = replaceText(originalText);
      if (originalText !== newText) {
        node.nodeValue = newText;
      }
    } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
      // 处理元素节点的属性
      if (node.hasAttribute('href')) {
        const href = node.getAttribute('href');
        if (href) {
          const newHref = replaceText(href);
          if (href !== newHref) {
            node.setAttribute('href', newHref);
          }
        }
      }
      if (node.hasAttribute('src')) {
        const src = node.getAttribute('src');
        if (src) {
          const newSrc = replaceText(src);
          if (src !== newSrc) {
            node.setAttribute('src', newSrc);
          }
        }
      }
      if (node.hasAttribute('content')) {
        const content = node.getAttribute('content');
        if (content) {
          const newContent = replaceText(content);
          if (content !== newContent) {
            node.setAttribute('content', newContent);
          }
        }
      }
      
      // 递归处理子节点
      for (let i = 0; i < node.childNodes.length; i++) {
        replaceTextInNode(node.childNodes[i]);
      }
    }
  }

  // 如果需要替换，立即执行并设置监控
  if (shouldReplace()) {
    // 立即替换当前已加载的所有内容
    replaceTextInNode(document.documentElement);

    // 使用MutationObserver监控后续添加的内容
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(function(node) {
            replaceTextInNode(node);
          });
        }
      });
    });

    // 开始监控
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });

    // 在DOMContentLoaded时再次确保替换完整
    document.addEventListener('DOMContentLoaded', function() {
      replaceTextInNode(document.documentElement);
    }, { once: true, passive: true });

    // 监听 document.write，如果有使用的话
    const originalWrite = document.write;
    document.write = function(html) {
      const processedHtml = replaceText(html);
      originalWrite.call(document, processedHtml);
    };

    const originalWriteln = document.writeln;
    document.writeln = function(html) {
      const processedHtml = replaceText(html);
      originalWriteln.call(document, processedHtml);
    };
  }
})();
