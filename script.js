// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Form submission handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        try {
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = '提交中...';
            submitButton.disabled = true;
            
            // Send data to server
            const response = await fetch('http://localhost:3000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert('感谢您的咨询！我们的顾问将尽快与您联系。');
                this.reset();
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('提交失败，请稍后重试。');
        } finally {
            // Reset button state
            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
}

// Add scroll animation for elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe all sections and cards
document.querySelectorAll('section, .program-card, .success-card, .mentor-card, .news-card').forEach(element => {
    observer.observe(element);
});

// Add mobile menu toggle functionality
const createMobileMenu = () => {
    const nav = document.querySelector('nav');
    const navLinks = document.querySelector('.nav-links');
    
    // Create hamburger button
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.innerHTML = '☰';
    nav.appendChild(hamburger);
    
    // Toggle menu on click
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });
};

// Initialize mobile menu if needed
if (window.innerWidth <= 768) {
    createMobileMenu();
}

// Add number counter animation
const animateNumber = (element, target) => {
    let current = 0;
    const increment = target / 100;
    const duration = 2000; // 2 seconds
    const stepTime = duration / 100;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
};

// Start number animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            document.querySelectorAll('.stat-number').forEach(stat => {
                const target = parseInt(stat.textContent);
                animateNumber(stat, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Add floating CTA button scroll behavior
const floatingCTA = document.querySelector('.floating-cta');
if (floatingCTA) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            floatingCTA.style.opacity = '1';
        } else {
            floatingCTA.style.opacity = '0';
        }
    });
}

// Add hover effect for program cards
document.querySelectorAll('.program-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
    
});

// 处理新闻图片上传
document.querySelectorAll('.image-upload').forEach(input => {
    input.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            const placeholder = this.closest('.image-placeholder');
            
            reader.onload = function(e) {
                // 创建新的图片元素
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                
                // 清空并添加新图片
                placeholder.innerHTML = '';
                placeholder.appendChild(img);
                
                // 保持上传功能
                const newInput = input.cloneNode(true);
                newInput.addEventListener('change', input.onchange);
                placeholder.appendChild(newInput);
            };
            
            reader.readAsDataURL(file);
        }
    });
});

// 热点数据获取与展示
const mockBaiduData = [
    { word: "神舟十八号发射成功", hotScore: "3.2亿", index: 1 },
    { word: "AI芯片技术突破", hotScore: "2.8亿", index: 2 },
    { word: "新能源汽车产业发展", hotScore: "2.5亿", index: 3 },
    { word: "教育改革新政策", hotScore: "2.3亿", index: 4 },
    { word: "医疗健康科技创新", hotScore: "2.1亿", index: 5 },
    { word: "数字经济发展趋势", hotScore: "1.9亿", index: 6 },
    { word: "环保技术新突破", hotScore: "1.8亿", index: 7 },
    { word: "乡村振兴成果展示", hotScore: "1.6亿", index: 8 }
];

const mockTechData = [
    { word: "量子计算研究进展", hotScore: "2.9亿", index: 1 },
    { word: "6G技术发展规划", hotScore: "2.7亿", index: 2 },
    { word: "机器人产业升级", hotScore: "2.4亿", index: 3 },
    { word: "芯片自主研发突破", hotScore: "2.2亿", index: 4 },
    { word: "元宇宙技术创新", hotScore: "2.0亿", index: 5 },
    { word: "智慧城市建设进展", hotScore: "1.8亿", index: 6 },
    { word: "区块链应用落地", hotScore: "1.7亿", index: 7 },
    { word: "绿色科技发展趋势", hotScore: "1.5亿", index: 8 }
];

function renderHotList(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = data.map(item => `
        <div class="hot-item">
            <div class="hot-rank ${item.index <= 3 ? 'rank-' + item.index : 'normal'} ${item.index <= 3 ? 'top-3' : ''}">
                ${item.index}
            </div>
            <a href="#" class="hot-title" title="${item.word}">${item.word}</a>
            <span class="hot-score">${item.hotScore}</span>
        </div>
    `).join('');
}

// 使用缓存机制获取数据
function fetchWithCache(cacheKey, mockData, containerId) {
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
        renderHotList(JSON.parse(cachedData), containerId);
    }

    // 模拟API请求
    setTimeout(() => {
        localStorage.setItem(cacheKey, JSON.stringify(mockData));
        renderHotList(mockData, containerId);
    }, 1000);
}

// 初始化热点列表
document.addEventListener('DOMContentLoaded', () => {
    fetchWithCache('baidu-hot', mockBaiduData, 'baidu-hot-list');
    fetchWithCache('tech-hot', mockTechData, 'tech-hot-list');
});

// 定时更新数据（每5分钟）
setInterval(() => {
    fetchWithCache('baidu-hot', mockBaiduData, 'baidu-hot-list');
    fetchWithCache('tech-hot', mockTechData, 'tech-hot-list');
}, 5 * 60 * 1000); 