var pexels = pexels || {};

(function($) {

    pexels = {

        init : function (options) {

            var defaults = {
                pexels_app_id: '',
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
            this.fail = $('.fail');
            this.success = $('.success');
            this.messageText = $('.message-text');
            this.remainingRequests = $('#remaining-requests');
            this.possibleRequests = $('#possible-requests');
            this.total = $('#total');

            this.page = 1;
            this.orderBy = 'latest';

            this.initMasonary();
            this.getImages();
            this.searchBtn();
            this.loadMoreBtn();
            this.downloadBtn();
        },
        getImages : function() {

            pexels.message.removeClass('hidden');
            pexels.loader.removeClass('hidden');
            pexels.messageText.text('Getting images ...');

            var ajaxURL = 'https://api.pexels.com/v1/popular';

            if(pexels.method == "search") {
                ajaxURL = 'https://api.pexels.com/v1/search';
            }

            $.ajax({
                url: ajaxURL,
                type: 'GET',
                dataType: 'json',
                data: {
                    page: pexels.page,
                    per_page: pexels.options.limit,
                    query: pexels.query,
                },
                beforeSend: function(xhr) {
                     xhr.setRequestHeader("Authorization", pexels.options.pexels_app_id); //Some characters have been replaced for security but this is a true BASE64 of "username:password"
                },
                async: true,
                success: function(data, textStatus, request) {

                    if(pexels.method == "search") {
                        if(data.total_results === 0) {
                            pexels.message.removeClass('info').addClass('fail');
                            pexels.messageText.text('No images found');
                            return false;
                        }
                        data = data.results;
                    }
                    pexels.message.addClass('hidden');
                    pexels.loader.addClass('hidden');
                    pexels.renderImages(data.photos);
                }, 
                error: function(request, textStatus, errorThrown) {
                    console.log(request);
                    console.log(textStatus);
                    console.log(errorThrown);
                    pexels.loader.addClass('hidden');
                    pexels.fail.removeClass('hidden');
                    var error = JSON.parse(request.responseText);
                    pexels.message.removeClass('info').addClass('fail');
                    pexels.messageText.text(error.error); // 'Error getting images ...'
                }
            });

        },
        getCategories : function(method) {

            var ajaxURL = 'https://api.pexels.com/categories';

            $.ajax({
                url: ajaxURL,
                type: 'GET',
                dataType: 'json',
                data: {
                    client_id: pexels.options.pexels_app_id,
                },
                success: function(data, textStatus, request) {

                    console.log(data);
                    console.log(request.getAllResponseHeaders());
                    console.log(request.getResponseHeader('X-Ratelimit-Remaining'));
                    console.log(request.getResponseHeader('X-Ratelimit-Limit'));

                    pexels.renderCategories(data);
                }, 
                error: function(request, textStatus, errorThrown) {
                    console.log(request);
                    console.log(textStatus);
                    console.log(errorThrown);
                    pexels.message.removeClass('info').addClass('fail');
                    pexels.loader.addClass('hidden');
                    pexels.fail.removeClass('hidden');
                    pexels.messageText.text('Error getting images ...');
                }
            });

        },
        renderCategories : function(data) {

            var categories = "";
            $(data).each(function(i, item) {

                categories +=    '<option value="' + item.id + '">' + item.title + '</option>';                
            });

            pexels.categoriesSelect.html(categories);
        },
        renderImages : function(data) {

            var items = "";
            var containerWidth = pexels.innercontainer.width();
            var itemWidth = (containerWidth / pexels.options.columns) - 20;

            var title = pexels.options.title;
            var caption = pexels.options.caption;
            var alt = pexels.options.alt;
            var desc = pexels.options.desc;

            title = title.replace("%stock_site%", 'pexels');
            caption = caption.replace("%stock_site%", 'pexels');
            alt = alt.replace("%stock_site%", 'pexels');
            desc = desc.replace("%stock_site%", 'pexels');
            
            $(data).each(function(i, item) {
                console.log(item);

                title = title.replace("%author%", item.photographer);
                caption = caption.replace("%author%", item.photographer);
                alt = alt.replace("%author%", item.photographer);
                desc = desc.replace("%author%", item.photographer);

                items +=    '<div class="item">' +
                                '<a href="'+ item.src.original + '"><img src="'+ item.src.medium + '" width="' + itemWidth + 'px" alt="" /></a>' +
                                // '<span class="likes" title="'+ item.likes +' Like(s)"><img draggable="false" class="emoji" alt="❤" src="https://s.w.org/images/core/emoji/2.2.1/svg/2764.svg">'+ item.likes +'</span>' +
                                '<a class="num download" target="_blank" href="'+ item.src.original + '" data-id="'+ item.id +'" data-title="'+ title +'" data-caption="'+ caption +'" data-alt="'+ alt +'" data-desc="'+ desc +'" title="Download and Import"><i class="fa fa-download"></i></a>' +
                                '<a class="num profile" target="_blank" data-username="'+ item.photographer +'" href="https://www.pexels.com/u/'+ item.photographer +'" title="View all photos by '+ item.photographer +' @ pexels.com"><i class="fa fa-user"></i></a>' +
                                '<a class="num zoom-in" target="_blank" href="'+ item.url + '" title="View Full Size"><i class="fa fa-search-plus"></i></a>' +
                            '</div>';
            }).promise().done( function() {
                pexels.innercontainer.append(items);
                pexels.refreshMansonary();
            });
        },
        initMasonary : function() {
            var containerWidth = pexels.innercontainer.width();
            var w = (containerWidth / pexels.options.columns) - 20;

            pexels.innercontainer.imagesLoaded(function() {
                pexels.innercontainer.masonry({
                    columnWidth: w,
                    itemSelector: '.item',
                    gutter: 20
                });
            });
        },
        refreshMansonary : function() {
            pexels.innercontainer.imagesLoaded(function() {
                pexels.innercontainer.masonry('reload');
            });
        },
        clearImages : function() {
            pexels.innercontainer.empty();
        },
        downloadImage : function(id, image, title, caption, alt, desc){

            pexels.message.removeClass('hidden');
            pexels.loader.removeClass('hidden');
            pexels.messageText.text('Downloading image ...');
            

            $.ajax({
                type: 'POST',
                url: pexels.options.ajax_url,
                dataType: 'JSON',

                data: {
                    action: 'wordpress_stocks_upload',
                    id: id, 
                    image: image, 
                    title: title, 
                    caption: caption, 
                    alt: alt, 
                    desc: desc, 
                    nonce: pexels.options.admin_nonce,
                },          
                success: function(response) {  

                    pexels.message.removeClass('info').addClass('success');
                    pexels.loader.addClass('hidden');
                    pexels.success.removeClass('hidden');
                    pexels.messageText.text('Image downloaded & imported');

                    setTimeout( function(){ 
                        pexels.success.addClass('hidden');
                        pexels.message.addClass('hidden');
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
                            // pexels.resizeImage(path, filename, desc, url, el);
                        }
                    }else{ // If response is empty
                        // pexels.uploadError(el);
                    }
                },          
                error: function(xhr, status, error) {
                    console.log(error);
                    // pexels.uploadError(el);
                }
            });
        },
        getUsersImagesBtn : function() {

            $(document).on('click', '.profile', function(e) {
                e.preventDefault();

                var $this = $(this);

                pexels.username = $this.data('username');

                pexels.method = 'users';
                pexels.clearImages();
                return pexels.getImages();
            });

        },
        searchBtn : function() {

            $(document).on('focusout', '.search', function(e) {
                e.preventDefault();

                var $this = $(this);
                var query = $this.val();

                if(query !== "") {
                    pexels.query = query;
                    pexels.method = 'search';
                } else {
                    pexels.method = '';
                }
                pexels.clearImages();
                return pexels.getImages();
            });
        },
        orderByBtn : function() {

            $(document).on('change', '#pexels-order-by', function(e) {
                e.preventDefault();

                var $this = $(this);

                pexels.clearImages();

                pexels.orderBy = $this.find('option:selected').val();
                pexels.clearImages();
                return pexels.getImages();
            });
        },
        getCategoryImagesBtn : function() {

            $(document).on('change', '#pexels-categories', function(e) {
                e.preventDefault();

                var $this = $(this);
                var categoryId = $this.find('option:selected').val();

                if(categoryId !== "") {
                    pexels.clearImages();
                    pexels.category = categoryId;
                    pexels.method = 'category';
                } else {
                    pexels.method = '';
                }
                pexels.clearImages();
                return pexels.getImages();
            });
        },
        loadMoreBtn : function() {

            $(document).on('click', '.wordpress-stocks-load-more-btn', function(e) {
                e.preventDefault();

                var $this = $(this);
                var currentPage = $this.data('page');
                currentPage++;

                $this.data('page', currentPage);

                pexels.page = currentPage;
                
                return pexels.getImages();
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

                pexels.downloadImage(id, url, title, caption, alt, desc);
            });
        },
    };        

}(jQuery));