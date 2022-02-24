var foodshot = foodshot || {};

(function($) {

    foodshot = {

        init : function (options) {

            var defaults = {
                foodshot_app_id: '',
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
            this.method = 'featured';

            this.page = 1;
            this.orderBy = 'latest';

            this.initMasonary();
            this.getImages();
            // this.getCategories();
            // this.orderByBtn();
            this.searchBtn();
            // this.getUsersImagesBtn();
            // this.getCategoryImagesBtn();
            this.loadMoreBtn();
            this.downloadBtn();
        },
        getImages : function() {

            foodshot.message.removeClass('hidden');
            foodshot.loader.removeClass('hidden');
            foodshot.messageText.text('Getting images ...');

            var ajaxURL = 'https://foodshot.co/wp-admin/admin-ajax.php';
            
            if(foodshot.method == "popular") {
                foodshot.method = 'popular';
            }

            if(foodshot.method == "search") {
                foodshot.method = 'search';
            }

            $.ajax({
                url: ajaxURL,
                type: 'POST',
                dataType: 'html',
                data: {
                    page_no: foodshot.page,
                    archive: foodshot.method,
                    action: 'infinite_scroll',

                    // client_id: foodshot.options.foodshot_app_id,
                    // page: foodshot.page,
                    // per_page: foodshot.options.limit,
                    // order_by: foodshot.orderBy,
                    search_query: foodshot.query,
                    // category: foodshot.category,
                },
                success: function(data, textStatus, request) {
                    console.log(data);
                    if(foodshot.method == "search") {
                        if(data === "") {
                            foodshot.message.removeClass('info').addClass('fail');
                            foodshot.messageText.text('No images found');
                            return false;
                        }
                    }

                    var articles = $(data).find('article');

                    var items = [];
                    var item;
                    $(articles).each(function(i, item) {
                        item = $(item).find('img');
                        item = item.attr('src');
                        items[i] = [];
                        items[i].small = item;
                        items[i].full = item.substring(0, item.indexOf('?'));
                    });
                    console.log(items);
                    foodshot.message.addClass('hidden');
                    foodshot.loader.addClass('hidden');

                    foodshot.renderImages(items);
                }, 
                error: function(request, textStatus, errorThrown) {
                    console.log(request);
                    console.log(textStatus);
                    console.log(errorThrown);
                    foodshot.message.removeClass('info').addClass('fail');
                    foodshot.messageText.text('Error getting images ...');
                }
            });

        },
        renderImages : function(data) {

            var items = "";
            var containerWidth = foodshot.innercontainer.width();
            var itemWidth = (containerWidth / foodshot.options.columns) - 20;

            var title = foodshot.options.title;
            var caption = foodshot.options.caption;
            var alt = foodshot.options.alt;
            var desc = foodshot.options.desc;

            title = title.replace("%stock_site%", 'foodshot');
            caption = caption.replace("%stock_site%", 'foodshot');
            alt = alt.replace("%stock_site%", 'foodshot');
            desc = desc.replace("%stock_site%", 'foodshot');
            
            $(data).each(function(i, item) {
                console.log(item);

                // title = title.replace("%author%", item.user.name);
                // caption = caption.replace("%author%", item.user.name);
                // alt = alt.replace("%author%", item.user.name);
                // desc = desc.replace("%author%", item.user.name);

                items +=    '<div class="item">' +
                                '<a href="'+ item.full + '"><img src="'+ item.small + '" width="' + itemWidth + 'px" alt="" /></a>' +
                                '<a class="num download" target="_blank" href="'+ item.full + '" data-id="'+ item.full +'" data-title="'+ title +'" data-caption="'+ caption +'" data-alt="'+ alt +'" data-desc="'+ desc +'" title="Download and Import"><i class="fa fa-download"></i></a>' +
                                '<a class="num zoom-in" target="_blank" href="'+ item.full + '" title="View Full Size"><i class="fa fa-search-plus"></i></a>' +
                            '</div>';                
            }).promise().done( function() {
                foodshot.innercontainer.append(items);
                foodshot.refreshMansonary();
            });
        },
        initMasonary : function() {
            var containerWidth = foodshot.innercontainer.width();
            var w = (containerWidth / foodshot.options.columns) - 20;

            foodshot.innercontainer.imagesLoaded(function() {
                foodshot.innercontainer.masonry({
                    columnWidth: w,
                    itemSelector: '.item',
                    gutter: 20
                });
            });
        },
        refreshMansonary : function() {
            foodshot.innercontainer.imagesLoaded(function() {
                foodshot.innercontainer.masonry('reload');
            });
        },
        clearImages : function() {
            foodshot.innercontainer.empty();
        },
        downloadImage : function(id, image, title, caption, alt, desc){

            foodshot.message.removeClass('hidden');
            foodshot.loader.removeClass('hidden');
            foodshot.messageText.text('Downloading image ...');
            

            $.ajax({
                type: 'POST',
                url: foodshot.options.ajax_url,
                dataType: 'JSON',

                data: {
                    action: 'wordpress_stocks_upload',
                    id: id, 
                    image: image, 
                    title: title, 
                    caption: caption, 
                    alt: alt, 
                    desc: desc, 
                    nonce: foodshot.options.admin_nonce,
                },          
                success: function(response) {  

                    foodshot.message.removeClass('info').addClass('success');
                    foodshot.loader.addClass('hidden');
                    foodshot.success.removeClass('hidden');
                    foodshot.messageText.text('Image downloaded & imported');

                    setTimeout( function(){ 
                        foodshot.success.addClass('hidden');
                        foodshot.message.addClass('hidden');
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
                            // foodshot.resizeImage(path, filename, desc, url, el);
                        }
                    }else{ // If response is empty
                        // foodshot.uploadError(el);
                    }
                },          
                error: function(xhr, status, error) {
                    console.log(error);
                    // foodshot.uploadError(el);
                }
            });
        },
        getUsersImagesBtn : function() {

            $(document).on('click', '.profile', function(e) {
                e.preventDefault();

                var $this = $(this);

                foodshot.username = $this.data('username');

                foodshot.method = 'users';
                foodshot.clearImages();
                return foodshot.getImages();
            });

        },
        searchBtn : function() {

            $(document).on('focusout', '.search', function(e) {
                e.preventDefault();

                var $this = $(this);
                var query = $this.val();

                if(query !== "") {
                    foodshot.query = query;
                    foodshot.method = 'search';
                } else {
                    foodshot.method = 'featured';
                }
                foodshot.clearImages();
                return foodshot.getImages();
            });
        },
        orderByBtn : function() {

            $(document).on('change', '#foodshot-order-by', function(e) {
                e.preventDefault();

                var $this = $(this);

                foodshot.clearImages();

                foodshot.orderBy = $this.find('option:selected').val();
                foodshot.clearImages();
                return foodshot.getImages();
            });
        },
        getCategoryImagesBtn : function() {

            $(document).on('change', '#foodshot-categories', function(e) {
                e.preventDefault();

                var $this = $(this);
                var categoryId = $this.find('option:selected').val();

                if(categoryId !== "") {
                    foodshot.clearImages();
                    foodshot.category = categoryId;
                    foodshot.method = 'category';
                } else {
                    foodshot.method = '';
                }
                foodshot.clearImages();
                return foodshot.getImages();
            });
        },
        loadMoreBtn : function() {

            $(document).on('click', '.wordpress-stocks-load-more-btn', function(e) {
                e.preventDefault();

                var $this = $(this);
                var currentPage = $this.data('page');
                currentPage++;

                $this.data('page', currentPage);

                foodshot.page = currentPage;
                
                return foodshot.getImages();
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

                foodshot.downloadImage(id, url, title, caption, alt, desc);
            });
        },
    };        

}(jQuery));