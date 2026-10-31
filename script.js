document.addEventListener('DOMContentLoaded', function () {
    var preloader = document.getElementById('box2');
    setTimeout(function () {
        if (preloader) {
            preloader.classList.add('fade-out');
        }
    }, 900);

    var observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    var observer = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    var animatedSections = document.querySelectorAll('.box201');
    animatedSections.forEach(function (section) {
        observer.observe(section);
    });

    var cart = [];
    var wishlist = [];
    var cartDrawer = document.getElementById('box73');
    var cartBtn = document.getElementById('box131');
    var wishBtn = document.getElementById('box134');
    var closeCartBtn = document.getElementById('box77');
    var cartItemsContainer = document.getElementById('box78');
    var cartTotal = document.getElementById('box82');
    var cartCount = document.getElementById('box133');
    var wishCount = document.getElementById('box135');
    var drawerTitle = document.getElementById('box76');
    var drawerFooter = document.getElementById('box79');
    var isWishlistDrawer = false;

    function openDrawer(isWish) {
        isWishlistDrawer = isWish;
        if (drawerTitle) {
            drawerTitle.textContent = isWish ? 'Liked Products' : 'Your Cart';
        }
        if (drawerFooter) {
            drawerFooter.style.display = isWish ? 'none' : 'block';
        }
        updateDrawerUI();
        if (cartDrawer) {
            cartDrawer.classList.add('open');
        }
    }

    if (cartBtn) {
        cartBtn.addEventListener('click', function () {
            openDrawer(false);
        });
    }

    if (wishBtn) {
        wishBtn.addEventListener('click', function () {
            openDrawer(true);
        });
    }

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', function () {
            if (cartDrawer) {
                cartDrawer.classList.remove('open');
            }
        });
    }

    function triggerHaptic() {
        if (navigator.vibrate) {
            navigator.vibrate(40);
        }
    }

    function updateDrawerUI() {
        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = '';
        var activeData = isWishlistDrawer ? wishlist : cart;
        var total = 0;

        activeData.forEach(function (item, index) {
            total += item.price;
            var el = document.createElement('div');
            el.className = 'box781';
            el.innerHTML = '<div><div class="box782">' + item.name + '</div><div class="box783">$' + item.price.toFixed(2) + '</div></div><button class="box784" data-index="' + index + '"><i class="fa-solid fa-trash-can"></i></button>';
            cartItemsContainer.appendChild(el);
        });

        if (!isWishlistDrawer && cartTotal) {
            cartTotal.textContent = '$' + total.toFixed(2);
        }
        if (cartCount) {
            cartCount.textContent = cart.length;
        }
        if (wishCount) {
            wishCount.textContent = wishlist.length;
        }

        var deleteBtns = cartItemsContainer.querySelectorAll('.box784');
        deleteBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                triggerHaptic();
                var idx = parseInt(btn.getAttribute('data-index'));
                if (isWishlistDrawer) {
                    var removedName = wishlist[idx].name;
                    wishlist.splice(idx, 1);
                    document.querySelectorAll('.box39').forEach(function (card) {
                        var hb = card.querySelector('.box43');
                        if (hb && hb.getAttribute('data-name') === removedName) {
                            hb.classList.remove('liked');
                        }
                    });
                } else {
                    cart.splice(idx, 1);
                }
                updateDrawerUI();
            });
        });
    }

    function handleButtonLoading(button, originalText, duration, callback) {
        triggerHaptic();
        var rect = button.getBoundingClientRect();
        button.style.width = rect.width + 'px';
        button.style.height = rect.height + 'px';
        button.innerText = 'Loading...';
        button.disabled = true;

        setTimeout(function () {
            button.innerText = 'Added';
            if (callback) {
                callback();
            }
            setTimeout(function () {
                button.innerText = originalText;
                button.style.width = '';
                button.style.height = '';
                button.disabled = false;
            }, 1000);
        }, duration);
    }

    var addToCartBtns = document.querySelectorAll('.box48');
    addToCartBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var name = btn.getAttribute('data-name');
            var price = parseFloat(btn.getAttribute('data-price'));
            handleButtonLoading(btn, 'Add to Cart', 2000, function () {
                cart.push({ name: name, price: price });
                updateDrawerUI();
            });
        });
    });

    var likeBtns = document.querySelectorAll('.box43');
    likeBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            triggerHaptic();
            var name = btn.getAttribute('data-name');
            var price = parseFloat(btn.getAttribute('data-price'));
            var existingIndex = wishlist.findIndex(function (item) {
                return item.name === name;
            });

            if (existingIndex === -1) {
                wishlist.push({ name: name, price: price });
                btn.classList.add('liked');
            } else {
                wishlist.splice(existingIndex, 1);
                btn.classList.remove('liked');
            }
            if (wishCount) {
                wishCount.textContent = wishlist.length;
            }
        });
    });

    var quickViewModal = document.getElementById('box109');
    var closeQuickView = document.getElementById('box111');
    var quickViewBtns = document.querySelectorAll('.box42');
    var qvImg = document.getElementById('box113');
    var qvTitle = document.getElementById('box116');
    var qvPrice = document.getElementById('box117');
    var qvDesc = document.getElementById('box118');
    var qvAddBtn = document.getElementById('box119');
    var currentQvProduct = null;

    quickViewBtns.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            triggerHaptic();
            var name = btn.getAttribute('data-name');
            var price = parseFloat(btn.getAttribute('data-price'));
            var img = btn.getAttribute('data-img');
            var desc = btn.getAttribute('data-desc');

            currentQvProduct = { name: name, price: price };
            if (qvImg) qvImg.src = img;
            if (qvTitle) qvTitle.textContent = name;
            if (qvPrice) qvPrice.textContent = '$' + price.toFixed(2);
            if (qvDesc) qvDesc.textContent = desc;

            if (quickViewModal) {
                quickViewModal.classList.add('open');
            }
        });
    });

    if (closeQuickView) {
        closeQuickView.addEventListener('click', function () {
            if (quickViewModal) {
                quickViewModal.classList.remove('open');
            }
        });
    }

    if (qvAddBtn) {
        qvAddBtn.addEventListener('click', function () {
            if (!currentQvProduct) return;
            handleButtonLoading(qvAddBtn, 'Add To Shopping Cart', 1800, function () {
                cart.push(currentQvProduct);
                updateDrawerUI();
                if (quickViewModal) {
                    quickViewModal.classList.remove('open');
                }
            });
        });
    }

    var filterBtns = document.querySelectorAll('.box37');
    var productCards = document.querySelectorAll('.box39');

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            triggerHaptic();
            filterBtns.forEach(function (b) {
                b.classList.remove('active');
            });
            btn.classList.add('active');

            var cat = btn.getAttribute('data-cat');
            productCards.forEach(function (card) {
                if (cat === 'all' || card.getAttribute('data-category') === cat) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    var searchInput = document.getElementById('box32');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            var val = searchInput.value.toLowerCase();
            productCards.forEach(function (card) {
                var title = card.querySelector('.box46').textContent.toLowerCase();
                if (title.indexOf(val) !== -1) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    var studioCup = document.getElementById('box51');
    var studioHandle = document.getElementById('box52');
    var colorBtns = document.querySelectorAll('.box67');
    var finishBtns = document.querySelectorAll('.box69');
    var handleBtns = document.querySelectorAll('.box70');
    var customOrderBtn = document.getElementById('box586');

    colorBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            triggerHaptic();
            colorBtns.forEach(function (b) {
                b.classList.remove('active');
            });
            btn.classList.add('active');
            var col = btn.getAttribute('data-color');
            if (studioCup && studioHandle) {
                studioCup.style.backgroundColor = col;
                studioHandle.style.borderColor = col;
            }
        });
    });

    finishBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            triggerHaptic();
            finishBtns.forEach(function (b) {
                b.classList.remove('active');
            });
            btn.classList.add('active');
            var finish = btn.getAttribute('data-finish');

            if (studioCup) {
                if (finish === 'mat') {
                    studioCup.style.boxShadow = 'inset -15px -15px 30px rgba(0, 0, 0, 0.5), 0 15px 25px rgba(0,0,0,0.5)';
                } else if (finish === 'gloss') {
                    studioCup.style.boxShadow = 'inset -20px -20px 30px rgba(0,0,0,0.4), inset 15px 15px 25px rgba(255,255,255,0.5), 0 15px 30px rgba(0,0,0,0.6)';
                } else if (finish === 'metallic') {
                    studioCup.style.boxShadow = 'inset -25px -25px 40px rgba(255, 215, 0, 0.6), inset 15px 15px 30px rgba(255,255,255,0.8), 0 0 25px rgba(217,119,6,0.6)';
                }
            }
        });
    });

    handleBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            triggerHaptic();
            handleBtns.forEach(function (b) {
                b.classList.remove('active');
            });
            btn.classList.add('active');
            var handleType = btn.getAttribute('data-handle');

            if (studioHandle) {
                if (handleType === 'standard') {
                    studioHandle.style.display = 'block';
                    studioHandle.style.borderRadius = '0 30px 30px 0';
                } else if (handleType === 'square') {
                    studioHandle.style.display = 'block';
                    studioHandle.style.borderRadius = '0 6px 6px 0';
                } else if (handleType === 'minimal') {
                    studioHandle.style.display = 'none';
                }
            }
        });
    });

    if (customOrderBtn) {
        customOrderBtn.addEventListener('click', function () {
            handleButtonLoading(customOrderBtn, 'Order Custom Studio Cup ($35.00)', 2500, function () {
                cart.push({ name: 'Custom Studio Cup', price: 35.00 });
                updateDrawerUI();
            });
        });
    }

    var faqItems = document.querySelectorAll('.box101');
    faqItems.forEach(function (item) {
        var header = item.querySelector('.box102');
        if (header) {
            header.addEventListener('click', function () {
                triggerHaptic();
                var isActive = item.classList.contains('active');
                faqItems.forEach(function (i) {
                    i.classList.remove('active');
                });
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    var contactForm = document.getElementById('box118');
    var sendBtn = document.getElementById('box122');
    if (contactForm && sendBtn) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            handleButtonLoading(sendBtn, 'Send Message', 2000, function () {
                contactForm.reset();
            });
        });
    }

    var checkoutBtn = document.getElementById('box83');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function () {
            if (cart.length === 0) return;
            handleButtonLoading(checkoutBtn, 'Proceed to Checkout', 2000, function () {
                cart = [];
                updateDrawerUI();
                if (cartDrawer) {
                    cartDrawer.classList.remove('open');
                }
            });
        });
    }
});