<div class="wrap" id="foodshot" data-search="">
    <h1>
        <i class="fa fa-camera">
        </i>
        foodshot
        <?
        // file_get_contents('filename');
        ?>
    </h1>
    <div class="meta-info">
        <b><?php _e('Total images:', 'wordpress-stocks') ?></b> <span id="total"></span> / 
        <b><?php _e('Remaining Requests:', 'wordpress-stocks') ?></b> <span id="remaining-requests"></span> /
        <b><?php _e('Possible Requests:', 'wordpress-stocks') ?></b> <span id="possible-requests"></span>
    </div>

    <div class="media-frame wp-core-ui mode-grid mode-edit hide-menu">
        <div class="media-frame-content">
            <div class="media-toolbar wp-filter">
                <div class="media-toolbar-secondary">
                    <div class="view-switch media-grid-view-switch">
                        <a class="view-grid current" href="/wp-admin/upload.php?mode=grid">
                            <span class="screen-reader-text">
                                Grid View
                            </span>
                        </a>
                    </div>
                    <label class="screen-reader-text" for="unsplash-categories">
                        Filter by type
                    </label>
                    <select class="attachment-filters" id="unsplash-categories">
                        <option value="">All</option>
                        <option value="2">Buildings</option>
                        <option value="3">Food &amp; Drink</option>
                        <option value="4">Nature</option>
                        <option value="8">Objects</option>
                        <option value="6">People</option>
                        <option value="7">Technology</option>
                    </select>
                    <label class="screen-reader-text" for="unsplash-order-by">
                        Order By
                    </label>
                    <select class="attachment-filters" id="unsplash-order-by">
                        <option selected="selected" value="latest">
                            Latest
                        </option>
                        <option value="oldest">
                            Oldest
                        </option>
                        <option value="popular">
                            Popular
                        </option>
                    </select>
                </div>
                <div class="media-toolbar-primary search-form">
                    <label class="screen-reader-text" for="media-search-input">
                        Search Media
                    </label>
                    <input class="search" id="media-search-input" placeholder="Search media items..." type="search"/>
                </div>
            </div>
            <div id="message" class="message clear info hidden">
                <div class="loader hidden">
                    <svg version="1.1" id="L9" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                      viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve">
                        <path fill="#fff" d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
                          <animateTransform 
                             attributeName="transform" 
                             attributeType="XML" 
                             type="rotate"
                             dur="1s" 
                             from="0 50 50"
                             to="360 50 50" 
                             repeatCount="indefinite" />
                      </path>
                    </svg>
                </div>
                <div class="success hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="-263.5 236.5 26 26">
                        <g class="svg-success">
                            <circle cx="-250.5" cy="249.5" r="12"/>
                            <path d="M-256.46 249.65l3.9 3.74 8.02-7.8"/>
                        </g>
                    </svg>
                </div>
                <div class="fail hidden">
                    <i class="fa fa-exclamation fa-2x"></i>
                </div>
                <span class="message-text"></span>
            </div>
            <div id="wordpress-stocks-outer-container" class="wordpress-stocks-outer-container">
                <div id="wordpress-stocks-inner-container" class="wordpress-stocks-inner-container">
                </div>
                <div class="wordpress-stocks-load-more-container">
                   <a data-page="1" href="#" class="wordpress-stocks-load-more-btn button">Load More Images</a>
                </div>
            </div>
        </div>
    </div>
</div>