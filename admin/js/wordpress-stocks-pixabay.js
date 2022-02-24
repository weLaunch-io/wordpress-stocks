var pixabay = pixabay || {};

(function($) {

    pixabay = {

        init : function (options) {

            var defaults = {
                pixabay_app_id: '',
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
            this.orderByBtn();
            this.searchBtn();
            this.getCategoryImagesBtn();
            this.loadMoreBtn();
            this.downloadBtn();
        },
        getImages : function() {

            pixabay.message.removeClass('hidden');
            pixabay.loader.removeClass('hidden');
            pixabay.messageText.text('Getting images ...');
            console.log(pixabay.query);

            var ajaxURL = 'https://pixabay.com/api/';

            if(pixabay.method == "search") {
                ajaxURL = 'https://pixabay.com/api/';
            }

            if(pixabay.method == "category") {
                ajaxURL = 'https://pixabay.com/api/';
            }
            console.log(pixabay.method);
            $.ajax({
                url: ajaxURL,
                type: 'GET',
                dataType: 'json',
                data: {
                    key: pixabay.options.pixabay_app_id,
                    page: pixabay.page,
                    per_page: pixabay.options.limit,
                    order: pixabay.orderBy,
                    q: pixabay.query,
                    category: pixabay.category,
                },
                success: function(data, textStatus, request) {
                    console.log(data);

                    if(pixabay.method == "search") {
                        if(data.hits === 0) {
                            pixabay.message.removeClass('info').addClass('fail');
                            pixabay.messageText.text('No images found');
                            return false;
                        }
                    }
                    data = data.hits;

                    // pixabay.remainingRequests.text(request.getResponseHeader('X-Ratelimit-Remaining'));
                    // pixabay.possibleRequests.text(request.getResponseHeader('X-Ratelimit-Limit'));
                    pixabay.total.text(data.total);
                    pixabay.message.addClass('hidden');
                    pixabay.loader.addClass('hidden');

                    pixabay.renderImages(data);
                }, 
                error: function(request, textStatus, errorThrown) {
                    console.log(request);
                    console.log(textStatus);
                    console.log(errorThrown);
                    pixabay.message.removeClass('info').addClass('fail');
                    pixabay.messageText.text('Error getting images ...');
                }
            });

        },
        renderImages : function(data) {

                    // comments:0
                    // downloads:0
                    // favorites:0
                    // id:2010572
                    // imageHeight:3444
                    // imageWidth:5229
                    // likes:0
                    // pageURL:"https://pixabay.com/en/thieves-offenses-wanted-burglary-2010572/"
                    // previewHeight:98
                    // previewURL:"https://cdn.pixabay.com/photo/2017/01/26/13/27/thieves-2010572_150.jpg"
                    // previewWidth:150
                    // tags:"thieves, offenses, wanted"
                    // type:"illustration"
                    // user:"Alexas_Fotos"
                    // userImageURL:"https://cdn.pixabay.com/user/2017/01/25/14-16-52-814_250x250.jpg"
                    // user_id:686414
                    // views:5
                    // webformatHeight:421
                    // webformatURL:"https://pixabay.com/get/eb35b00f2df3033ed95c4518b7484590eb72ebd304b0154990f4c57fa5e5bd_640.jpg"
                    // webformatWidth:640

            var items = "";
            var containerWidth = pixabay.innercontainer.width();
            var itemWidth = (containerWidth / pixabay.options.columns) - 20;

            var title = pixabay.options.title;
            var caption = pixabay.options.caption;
            var alt = pixabay.options.alt;
            var desc = pixabay.options.desc;

            title = title.replace("%stock_site%", 'pixabay');
            caption = caption.replace("%stock_site%", 'pixabay');
            alt = alt.replace("%stock_site%", 'pixabay');
            desc = desc.replace("%stock_site%", 'pixabay');
            
            $(data).each(function(i, item) {
                console.log(item);

                title = title.replace("%author%", item.tags);
                caption = caption.replace("%author%", item.tags);
                alt = alt.replace("%author%", item.tags);
                desc = desc.replace("%author%", item.tags);

                items +=    '<div class="item">' +
                                '<a href="'+ item.pageURL + '"><img src="'+ item.previewURL + '" width="' + item.previewWidth + 'px" alt="" /></a>' +
                                '<span class="likes" title="'+ item.likes +' Like(s)"><img draggable="false" class="emoji" alt="❤" src="https://s.w.org/images/core/emoji/2.2.1/svg/2764.svg">'+ item.likes +'</span>' +
                                '<a class="num download" target="_blank" href="'+ item.webformatURL + '" data-id="'+ item.id +'" data-title="'+ title +'" data-caption="'+ caption +'" data-alt="'+ alt +'" data-desc="'+ desc +'" title="Download and Import"><i class="fa fa-download"></i></a>' +
                                '<a class="num profile" target="_blank" data-username="'+ item.user +'" href="https://pixabay.com/en/users/'+ item.user +'" title="View all photos by '+ item.user +' @ pixabay.com"><i class="fa fa-user"></i></a>' +
                                '<a class="num zoom-in" target="_blank" href="'+ item.pageURL + '" title="View Full Size"><i class="fa fa-search-plus"></i></a>' +
                            '</div>';                
            }).promise().done( function() {
                pixabay.innercontainer.append(items);
                pixabay.refreshMansonary();
            });
        },
        initMasonary : function() {
            var containerWidth = pixabay.innercontainer.width();
            var w = (containerWidth / pixabay.options.columns) - 20;

            pixabay.innercontainer.imagesLoaded(function() {
                pixabay.innercontainer.masonry({
                    columnWidth: w,
                    itemSelector: '.item',
                    gutter: 20
                });
            });
        },
        refreshMansonary : function() {
            pixabay.innercontainer.imagesLoaded(function() {
                pixabay.innercontainer.masonry('reload');
            });
        },
        clearImages : function() {
            pixabay.innercontainer.empty();
        },
        downloadImage : function(id, image, title, caption, alt, desc){

            pixabay.message.removeClass('hidden');
            pixabay.loader.removeClass('hidden');
            pixabay.messageText.text('Downloading image ...');
            

            $.ajax({
                type: 'POST',
                url: pixabay.options.ajax_url,
                dataType: 'JSON',

                data: {
                    action: 'wordpress_stocks_upload',
                    id: id, 
                    image: image, 
                    title: title, 
                    caption: caption, 
                    alt: alt, 
                    desc: desc, 
                    nonce: pixabay.options.admin_nonce,
                },          
                success: function(response) {  

                    pixabay.message.removeClass('info').addClass('success');
                    pixabay.loader.addClass('hidden');
                    pixabay.success.removeClass('hidden');
                    pixabay.messageText.text('Image downloaded & imported');

                    setTimeout( function(){ 
                        pixabay.success.addClass('hidden');
                        pixabay.message.addClass('hidden');
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
                            // pixabay.resizeImage(path, filename, desc, url, el);
                        }
                    }else{ // If response is empty
                        // pixabay.uploadError(el);
                    }
                },          
                error: function(xhr, status, error) {
                    console.log(error);
                    // pixabay.uploadError(el);
                }
            });
        },
        searchBtn : function() {

            $(document).on('focusout', '.search', function(e) {
                e.preventDefault();

                var $this = $(this);
                var query = $this.val();

                if(query !== "") {
                    pixabay.query = query;
                    pixabay.method = 'search';
                } else {
                    pixabay.method = '';
                }
                pixabay.clearImages();
                return pixabay.getImages();
            });
        },
        orderByBtn : function() {

            $(document).on('change', '#pixabay-order-by', function(e) {
                e.preventDefault();

                var $this = $(this);

                pixabay.clearImages();

                pixabay.orderBy = $this.find('option:selected').val();
                pixabay.clearImages();
                return pixabay.getImages();
            });
        },
        getCategoryImagesBtn : function() {

            $(document).on('change', '#pixabay-categories', function(e) {
                e.preventDefault();
                console.log('tst');
                var $this = $(this);
                var categoryId = $this.find('option:selected').val();

                if(categoryId !== "") {
                    pixabay.clearImages();
                    pixabay.category = categoryId;
                    pixabay.method = 'category';
                } else {
                    pixabay.method = '';
                }
                pixabay.clearImages();
                return pixabay.getImages();
            });
        },
        loadMoreBtn : function() {

            $(document).on('click', '.wordpress-stocks-load-more-btn', function(e) {
                e.preventDefault();

                var $this = $(this);
                var currentPage = $this.data('page');
                currentPage++;

                $this.data('page', currentPage);

                pixabay.page = currentPage;
                
                return pixabay.getImages();
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

                pixabay.downloadImage(id, url, title, caption, alt, desc);
            });
        },
    };        

}(jQuery));