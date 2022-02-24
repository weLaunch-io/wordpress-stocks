var unsplash = unsplash || {};

(function($) {

    unsplash = {

        init : function (options) {

            var defaults = {
                unsplash_app_id: '',
                limit: '',
                columns: '',
                width: ''
            };

            this.options = $.extend(defaults, options);

            this.innercontainer = $('.wordpress-stocks-inner-container');
            this.outercontainer = $('.wordpress-stocks-outer-container');
            this.downloadButton = $('.download');
            this.message = $('.message');
            this.loader = $('.loader');
            this.success = $('.success');
            this.messageText = $('.message-text');
            this.remainingRequests = $('#remaining-requests');
            this.possibleRequests = $('#possible-requests');
            this.total = $('#total');

            this.page = 1;
            this.orderBy = 'latest';

            this.initMasonary();
            this.getImages();
            // this.getCategories();
            this.orderByBtn();
            this.searchBtn();
            this.getUsersImagesBtn();
            this.getCategoryImagesBtn();
            this.loadMoreBtn();
            this.downloadBtn();
        },
        getImages : function() {

            unsplash.message.removeClass('hidden');
            unsplash.loader.removeClass('hidden');
            unsplash.messageText.text('Getting images ...');
            console.log(unsplash.query);

            var ajaxURL = 'https://api.unsplash.com/photos';
            if(unsplash.method == "users") {
                ajaxURL = 'https://api.unsplash.com/users/'+ unsplash.username +'/photos';
            }

            if(unsplash.method == "search") {
                ajaxURL = 'https://api.unsplash.com/search/photos';
            }

            if(unsplash.method == "category") {
                ajaxURL = 'https://api.unsplash.com/categories/'+ unsplash.category +'/photos';
            }

            $.ajax({
                url: ajaxURL,
                type: 'GET',
                dataType: 'json',
                data: {
                    client_id: unsplash.options.unsplash_app_id,
                    page: unsplash.page,
                    per_page: unsplash.options.limit,
                    order_by: unsplash.orderBy,
                    query: unsplash.query,
                    category: unsplash.category,
                },
                success: function(data, textStatus, request) {

                    if(unsplash.method == "search") {
                        if(data.total === 0) {
                            unsplash.message.removeClass('info').addClass('fail');
                            unsplash.messageText.text('No images found');
                            return false;
                        }
                        data = data.results;
                    }

                    unsplash.remainingRequests.text(request.getResponseHeader('X-Ratelimit-Remaining'));
                    unsplash.possibleRequests.text(request.getResponseHeader('X-Ratelimit-Limit'));
                    unsplash.total.text(request.getResponseHeader('X-Total'));
                    unsplash.message.addClass('hidden');
                    unsplash.loader.addClass('hidden');

                    unsplash.renderImages(data);
                }, 
                error: function(request, textStatus, errorThrown) {
                    console.log(request);
                    console.log(textStatus);
                    console.log(errorThrown);
                    unsplash.message.removeClass('info').addClass('fail');
                    unsplash.messageText.text('Error getting images ...');
                }
            });

        },
        getCategories : function(method) {

            var ajaxURL = 'https://api.unsplash.com/categories';

            $.ajax({
                url: ajaxURL,
                type: 'GET',
                dataType: 'json',
                data: {
                    client_id: unsplash.options.unsplash_app_id,
                },
                success: function(data, textStatus, request) {

                    console.log(data);
                    console.log(request.getAllResponseHeaders());
                    console.log(request.getResponseHeader('X-Ratelimit-Remaining'));
                    console.log(request.getResponseHeader('X-Ratelimit-Limit'));

                    unsplash.renderCategories(data);
                }, 
                error: function(request, textStatus, errorThrown) {
                    console.log(request);
                    console.log(textStatus);
                    console.log(errorThrown);
                    unsplash.message.removeClass('info').addClass('fail');
                    unsplash.messageText.text('Error getting images ...');
                }
            });

        },
        renderCategories : function(data) {

            var categories = "";
            $(data).each(function(i, item) {

                categories +=    '<option value="' + item.id + '">' + item.title + '</option>';                
            });

            unsplash.categoriesSelect.html(categories);
        },
        renderImages : function(data) {

            var items = "";
            var containerWidth = unsplash.innercontainer.width();
            var itemWidth = (containerWidth / unsplash.options.columns) - 20;

            var title = unsplash.options.title;
            var caption = unsplash.options.caption;
            var alt = unsplash.options.alt;
            var desc = unsplash.options.desc;

            title = title.replace("%stock_site%", 'Unsplash');
            caption = caption.replace("%stock_site%", 'Unsplash');
            alt = alt.replace("%stock_site%", 'Unsplash');
            desc = desc.replace("%stock_site%", 'Unsplash');
            
            $(data).each(function(i, item) {
                console.log(item);

                title = title.replace("%author%", item.user.name);
                caption = caption.replace("%author%", item.user.name);
                alt = alt.replace("%author%", item.user.name);
                desc = desc.replace("%author%", item.user.name);

                items +=    '<div class="item">' +
                                '<a href="'+ item.urls.full + '"><img src="'+ item.urls.small + '" width="' + itemWidth + 'px" alt="" /></a>' +
                                '<span class="likes" title="'+ item.likes +' Like(s)"><img draggable="false" class="emoji" alt="❤" src="https://s.w.org/images/core/emoji/2.2.1/svg/2764.svg">'+ item.likes +'</span>' +
                                '<a class="num download" target="_blank" href="'+ item.urls.full + '" data-id="'+ item.id +'" data-title="'+ title +'" data-caption="'+ caption +'" data-alt="'+ alt +'" data-desc="'+ desc +'" title="Download and Import"><i class="fa fa-download"></i></a>' +
                                '<a class="num profile" target="_blank" data-username="'+ item.user.username +'" href="https://unsplash.com/@'+ item.user.username +'" title="View all photos by '+ item.user.username +' @ unsplash.com"><i class="fa fa-user"></i></a>' +
                                '<a class="num zoom-in" target="_blank" href="'+ item.urls.full + '" title="View Full Size"><i class="fa fa-search-plus"></i></a>' +
                            '</div>';                
            }).promise().done( function() {
                unsplash.innercontainer.append(items);
                unsplash.refreshMansonary();
            });
        },
        initMasonary : function() {
            var containerWidth = unsplash.innercontainer.width();
            var w = (containerWidth / unsplash.options.columns) - 20;

            unsplash.innercontainer.imagesLoaded(function() {
                unsplash.innercontainer.masonry({
                    columnWidth: w,
                    itemSelector: '.item',
                    gutter: 20
                });
            });
        },
        refreshMansonary : function() {
            unsplash.innercontainer.imagesLoaded(function() {
                unsplash.innercontainer.masonry('reload');
            });
        },
        clearImages : function() {
            unsplash.innercontainer.empty();
        },
        downloadImage : function(id, image, title, caption, alt, desc){

            unsplash.message.removeClass('hidden');
            unsplash.loader.removeClass('hidden');
            unsplash.messageText.text('Downloading image ...');
            

            $.ajax({
                type: 'POST',
                url: unsplash.options.ajax_url,
                dataType: 'JSON',

                data: {
                    action: 'wordpress_stocks_upload',
                    id: id, 
                    image: image, 
                    title: title, 
                    caption: caption, 
                    alt: alt, 
                    desc: desc, 
                    nonce: unsplash.options.admin_nonce,
                },          
                success: function(response) {  

                    unsplash.message.removeClass('info').addClass('success');
                    unsplash.loader.addClass('hidden');
                    unsplash.success.removeClass('hidden');
                    unsplash.messageText.text('Image downloaded & imported');

                    setTimeout( function(){ 
                        unsplash.success.addClass('hidden');
                        unsplash.message.addClass('hidden');
                    } , 4000);

                    if(response){
                        var hasError = response.error,
                        path = response.path,
                        filename = response.filename,
                        desc = response.desc,
                        url = response.url,
                        msg = response.msg;
                                           
                        if(hasError){
                            // Error    
                            // $('.notice-msg', el).removeClass('active').text('');              
                            // el.removeClass('saving').removeClass('uploaded');
                            // if(!$('span.err', el).length){
                            //     el.append('<span class="err" title="'+ msg +'"><i class="fa fa-exclamation-circle"></i></span>');
                            // }
                        }else{ 
                            // Success!
                            // unsplash.resizeImage(path, filename, desc, url, el);
                        }
                    }else{ // If response is empty
                        // unsplash.uploadError(el);
                    }
                },          
                error: function(xhr, status, error) {
                    console.log(error);
                    // unsplash.uploadError(el);
                }
            });
        },
        getUsersImagesBtn : function() {

            $(document).on('click', '.profile', function(e) {
                e.preventDefault();

                var $this = $(this);

                unsplash.username = $this.data('username');

                unsplash.method = 'users';
                unsplash.clearImages();
                return unsplash.getImages();
            });

        },
        searchBtn : function() {

            $(document).on('focusout', '.search', function(e) {
                e.preventDefault();

                var $this = $(this);
                var query = $this.val();

                if(query !== "") {
                    unsplash.query = query;
                    unsplash.method = 'search';
                } else {
                    unsplash.method = '';
                }
                unsplash.clearImages();
                return unsplash.getImages();
            });
        },
        orderByBtn : function() {

            $(document).on('change', '#unsplash-order-by', function(e) {
                e.preventDefault();

                var $this = $(this);

                unsplash.clearImages();

                unsplash.orderBy = $this.find('option:selected').val();
                unsplash.clearImages();
                return unsplash.getImages();
            });
        },
        getCategoryImagesBtn : function() {

            $(document).on('change', '#unsplash-categories', function(e) {
                e.preventDefault();

                var $this = $(this);
                var categoryId = $this.find('option:selected').val();

                if(categoryId !== "") {
                    unsplash.clearImages();
                    unsplash.category = categoryId;
                    unsplash.method = 'category';
                } else {
                    unsplash.method = '';
                }
                unsplash.clearImages();
                return unsplash.getImages();
            });
        },
        loadMoreBtn : function() {

            $(document).on('click', '.wordpress-stocks-load-more-btn', function(e) {
                e.preventDefault();

                var $this = $(this);
                var currentPage = $this.data('page');
                currentPage++;

                $this.data('page', currentPage);

                unsplash.page = currentPage;
                
                return unsplash.getImages();
            });
        },
        downloadBtn : function() {

            $(document).on('click', '.download', function(e) {
                e.preventDefault();

                var $this = $(this);

                var id = $this.data('id');
                var url = $this.attr('href');
                var title = $this.data('title');
                var caption = $this.data('caption');
                var alt = $this.data('alt');
                var desc = $this.data('desc');

                unsplash.downloadImage(id, url, title, caption, alt, desc);
            });
        },
    };        

}(jQuery));