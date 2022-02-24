<?php

class Wordpress_Stocks_Admin
{
    private $plugin_name;
    private $version;
    private $options;

    /**
     * Construct Stocks Admin Class
     * @author Daniel Barenkamp
     * @version 1.0.0
     * @since   1.0.0
     * @link    http://woocommerce.db-dzine.com
     * @param   string                         $plugin_name
     * @param   string                         $version    
     */
    public function __construct($plugin_name, $version)
    {
        $this->plugin_name = $plugin_name;
        $this->version = $version;
    }

    /**
     * Enqueue Admin Styles
     * @author Daniel Barenkamp
     * @version 1.0.0
     * @since   1.0.0
     * @link    http://woocommerce.db-dzine.de
     * @return  boolean
     */
    public function enqueue_styles()
    {
        
        wp_enqueue_style('media-views');
        wp_enqueue_style($this->plugin_name.'-font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css', array(), '4.7.0', 'all');
        wp_enqueue_style($this->plugin_name.'-custom', plugin_dir_url(__FILE__).'css/wordpress-stocks-admin.css', array(), $this->version, 'all');
    }

    /**
     * Enqueue Admin Scripts
     * @author Daniel Barenkamp
     * @version 1.0.0
     * @since   1.0.0
     * @link    http://woocommerce.db-dzine.de
     * @return  boolean
     */
    public function enqueue_scripts()
    {
        $options = $this->options;

        wp_enqueue_script('jquery');
        wp_enqueue_script('jquery-form');
        wp_enqueue_script('jquery-masonry');
        wp_enqueue_script($this->plugin_name.'-imagesloaded', plugin_dir_url(__FILE__).'js/imagesloaded.js', array('jquery'), '4.1.1', true);
        wp_enqueue_script($this->plugin_name.'-admin', plugin_dir_url(__FILE__).'js/wordpress-stocks-admin.js', array('jquery'), $this->version, true);

        if($this->get_option('unsplash')) {
            wp_enqueue_script($this->plugin_name.'-unsplash', plugin_dir_url(__FILE__).'js/wordpress-stocks-unsplash.js', array('jquery'), $this->version, true);
        }
        
        if($this->get_option('pexels')) {
            wp_enqueue_script($this->plugin_name.'-pexels', plugin_dir_url(__FILE__).'js/wordpress-stocks-pexels.js', array('jquery'), $this->version, true);
        }
        
        if($this->get_option('foodshot')) {
            wp_enqueue_script($this->plugin_name.'-foodshot', plugin_dir_url(__FILE__).'js/wordpress-stocks-foodshot.js', array('jquery'), $this->version, true);
        }
        
        if($this->get_option('pixabay')) {
            wp_enqueue_script($this->plugin_name.'-pixabay', plugin_dir_url(__FILE__).'js/wordpress-stocks-pixabay.js', array('jquery'), $this->version, true);
        }

        $forJS = array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'admin_nonce' => wp_create_nonce('wordpress_stocks_nonce'),
            'unsplash_app_id' => $this->get_option('unsplashAppId'),
            'pexels_app_id' => $this->get_option('pexelsAppId'),
            'pixabay_app_id' => $this->get_option('pixabayAppId'),
            'limit' => $this->get_option('limit'),
            'columns' => $this->get_option('columns'),
            'width' => $this->get_option('width'),
            'title' => $this->get_option('title'),
            'caption' => $this->get_option('caption'),
            'alt' => $this->get_option('alt'),
            'desc' => $this->get_option('desc'),
            // 'error_msg_title' => __('Error accessing Unsplash API', 'instant-images'),
            // 'error_msg_desc' => __('Please check your Application ID.', 'instant-images'),
            // 'error_upload' => __('Unable to save image, please check your server permissions.', 'instant-images'),
            // 'photo_by' => __('Photo by', 'instant-images'),
            // 'view_all' => __('View all photos by', 'instant-images'),
            // 'upload' => __('click to upload', 'instant-images'),
            // 'full_size' => __('View Full Size', 'instant-images'),
            // 'likes' => __('Like(s)', 'instant-images'),
            // 'saving' => __('Downloading photo', 'instant-images'),
            // 'resizing' => __('Resizing photo', 'instant-images'),
            // 'no_results' => __('Sorry, nothing matched your query', 'instant-images'),
            // 'no_results_desc' => __('Please try adjusting your search criteria', 'instant-images')
        );

        wp_localize_script($this->plugin_name.'-unsplash', 'wordpress_stocks_options', $forJS);
    }

    /**
     * Load Extensions
     * @author Daniel Barenkamp
     * @version 1.0.0
     * @since   1.0.0
     * @link    http://woocommerce.db-dzine.com
     * @return  boolean
     */
    public function load_extensions()
    {
        // Load the theme/plugin options
        if (file_exists(plugin_dir_path(dirname(__FILE__)).'admin/options-init.php')) {
            require_once plugin_dir_path(dirname(__FILE__)).'admin/options-init.php';
        }
    }

    /**
     * Get Options
     * @author Daniel Barenkamp
     * @version 1.0.0
     * @since   1.0.0
     * @link    http://woocommerce.db-dzine.com
     * @param   mixed                         $option The option key
     * @return  mixed                                 The option value
     */
    private function get_option($option)
    {
        if(!is_array($this->options)) {
            return false;
        }

        if (!array_key_exists($option, $this->options)) {
            return false;
        }

        return $this->options[$option];
    }

    /**
     * Init Admin facade
     * @author Daniel Barenkamp
     * @version 1.0.0
     * @since   1.0.0
     * @link    http://woocommerce.db-dzine.com
     * @return  [type]                         [description]
     */
    public function init()
    {
        global $Wordpress_Stocks_options;

        $this->options = $Wordpress_Stocks_options;

        if (!$this->get_option('enable')) {
            return false;
        }

        add_action('admin_menu', array($this, 'add_submenu_pages'), 6);
    }

    public function add_submenu_pages() 
    {
        if($this->get_option('unsplash')) {
            $usplash_settings_page = add_submenu_page( 'upload.php', 'Unsplash', 'Unsplash', 'edit_theme_options', 'unsplash', array($this, 'add_unsplash_page') );
        }

        if($this->get_option('pexels')) {
            $usplash_settings_page = add_submenu_page( 'upload.php', 'Pexels', 'Pexels', 'edit_theme_options', 'pexels', array($this, 'add_pexels_page') );
        }

        if($this->get_option('foodshot')) {
            $usplash_settings_page = add_submenu_page( 'upload.php', 'Foodshot', 'Foodshot', 'edit_theme_options', 'foodshot', array($this, 'add_foodshot_page') );
        }

        if($this->get_option('pixabay')) {
            $usplash_settings_page = add_submenu_page( 'upload.php', 'Pixabay', 'Pixabay', 'edit_theme_options', 'pixabay', array($this, 'add_pixabay_page') );
        }
    }

    public function add_unsplash_page()
    {
        include( dirname(__FILE__) . '/view/unsplash.php');
    }

    public function add_pexels_page()
    {
        include( dirname(__FILE__) . '/view/pexels.php');
    }

    public function add_foodshot_page()
    {
        include( dirname(__FILE__) . '/view/foodshot.php');
    }

    public function add_pixabay_page()
    {
        include( dirname(__FILE__) . '/view/pixabay.php');
    }

    public function upload(){

        if (current_user_can( 'edit_theme_options' )){
          
            error_reporting(E_ALL|E_STRICT);      
          
            $id = sanitize_key($_POST["id"]); // Image ID
            $img = $_POST["image"]; // Image URL
            $title = sanitize_text_field($_POST["title"]);
            $caption = sanitize_text_field($_POST["caption"]);
            $alt = sanitize_text_field($_POST["alt"]);
            $desc = sanitize_text_field($_POST["desc"]);

            $filename = $id.'.jpg';

            $uploaddir = wp_upload_dir();
            $uploadfile = $uploaddir['path'] . '/' . $filename;

            $contents = file_get_contents($img);
            $savefile = fopen($uploadfile, 'w');
            fwrite($savefile, $contents);
            fclose($savefile);

            $wp_filetype = wp_check_filetype(basename($filename), null );

            $attachment = array(
                'post_mime_type' => $wp_filetype['type'],
                'post_title' => $title,
                'post_content' => $desc,
                'post_excerpt' => $caption,
                'post_status' => 'inherit'
            );

            $attach_id = wp_insert_attachment( $attachment, $uploadfile );

            $imagenew = get_post( $attach_id );
            $fullsizepath = get_attached_file( $imagenew->ID );
            $attach_data = wp_generate_attachment_metadata( $attach_id, $fullsizepath );
            wp_update_attachment_metadata( $attach_id, $attach_data );

            update_post_meta($attach_id, '_wp_attachment_image_alt', $alt);

       }
    }
}