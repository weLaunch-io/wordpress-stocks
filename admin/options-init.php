<?php

    /**
     * For full documentation, please visit: http://docs.reduxframework.com/
     * For a more extensive sample-config file, you may look at:
     * https://github.com/reduxframework/redux-framework/blob/master/sample/sample-config.php
     */

    if ( ! class_exists( 'Redux' ) ) {
        return;
    }

    // This is your option name where all the Redux data is stored.
    $opt_name = "Wordpress_Stocks_options";

    /**
     * ---> SET ARGUMENTS
     * All the possible arguments for Redux.
     * For full documentation on arguments, please refer to: https://github.com/ReduxFramework/ReduxFramework/wiki/Arguments
     * */

    $theme = wp_get_theme(); // For use with some settings. Not necessary.

    $args = array(
        'opt_name' => 'Wordpress_Stocks_options',
        'use_cdn' => TRUE,
        'dev_mode' => FALSE,
        'display_name' => 'Wordpress Stocks',
        'display_version' => '1.0.0',
        'page_title' => 'Wordpress Stocks',
        'update_notice' => TRUE,
        'intro_text' => '',
        'footer_text' => '&copy; '.date('Y').' DB-Dzine',
        'admin_bar' => TRUE,
        'menu_type' => 'submenu',
        'menu_icon' =>  '',
        'menu_title' => 'Stocks Settings',
        'allow_sub_menu' => TRUE,
        'page_parent' => 'upload.php',
        'customizer' => FALSE,
        'default_mark' => '*',
        'hints' => array(
            'icon_position' => 'right',
            'icon_color' => 'lightgray',
            'icon_size' => 'normal',
            'tip_style' => array(
                'color' => 'light',
            ),
            'tip_position' => array(
                'my' => 'top left',
                'at' => 'bottom right',
            ),
            'tip_effect' => array(
                'show' => array(
'duration' => '500',
'event' => 'mouseover',
                ),
                'hide' => array(
'duration' => '500',
'event' => 'mouseleave unfocus',
                ),
            ),
        ),
        'output' => TRUE,
        'output_tag' => TRUE,
        'settings_api' => TRUE,
        'cdn_check_time' => '1440',
        'compiler' => TRUE,
        'page_permissions' => 'manage_options',
        'save_defaults' => TRUE,
        'show_import_export' => TRUE,
        'database' => 'options',
        'transient_time' => '3600',
        'network_sites' => TRUE,
    );

    Redux::setArgs( $opt_name, $args );

    /*
     * ---> END ARGUMENTS
     */

    /*
     * ---> START HELP TABS
     */

    $tabs = array(
        array(
            'id'      => 'help-tab',
            'title'   => __('Information', 'wordpress-stocks' ),
            'content' => __('<p>Need support? Please use the comment function on codecanyon.</p>', 'wordpress-stocks' )
        ),
    );
    Redux::setHelpTab( $opt_name, $tabs );

    // Set the help sidebar
    // $content = __('<p>This is the sidebar content, HTML is allowed.</p>', 'wordpress-stocks' );
    // Redux::setHelpSidebar( $opt_name, $content );


    /*
     * <--- END HELP TABS
     */


    /*
     *
     * ---> START SECTIONS
     *
     */

    Redux::setSection( $opt_name, array(
        'title'  => __('Settings', 'wordpress-stocks' ),
        'id'     => 'general',
        'desc'   => __('Need support? Please use the comment function on codecanyon.', 'wordpress-stocks' ),
        'icon'   => 'el el-home',
    ) );

    Redux::setSection( $opt_name, array(
        'title'      => __('General', 'wordpress-stocks' ),
        'id'         => 'general-settings',
        'subsection' => true,
        'fields'     => array(
            array(
                'id'       => 'enable',
                'type'     => 'checkbox',
                'title'    => __('Enable', 'wordpress-stocks' ),
                'subtitle' => __('Enable Stocks.', 'wordpress-stocks' ),
                'default'  => '1',
            ),
            array(
                'id'       => 'unsplash',
                'type'     => 'checkbox',
                'title'    => __('Enable Unsplash', 'wordpress-stocks' ),
                'default'  => '0',
            ),
            array(
                'id'       => 'unsplashAppId',
                'type'     => 'text',
                'title'    => __('Unsplash App ID', 'woocommerce-store-locator'),
                'subtitle'  => 'Have no app id? Get it here: <a href="https://unsplash.com/developers" target="_blank">https://unsplash.com/developers</a>',
                'default'     => 'ac2440143679fe6cabdec3a7c05d19336e6985f38a5808992db62cac654e7a7b',
                'required' => array('unsplash','equals','1'),
            ),
            array(
                'id'       => 'pexels',
                'type'     => 'checkbox',
                'title'    => __('Enable Pexels', 'wordpress-stocks' ),
                'default'  => '0',
            ),
            array(
                'id'       => 'pexelsAppId',
                'type'     => 'text',
                'title'    => __('Pexels App ID', 'woocommerce-store-locator'),
                'subtitle'  => 'Have no app id? Get it here: <a href="https://www.pexels.com/api/" target="_blank">https://www.pexels.com/api/</a>',
                'default'     => '563492ad6f9170000100000126ad49fea3af4e4b4fa2bb15b109ab04',
                'required' => array('pexels','equals','1'),
            ),
            // array(
            //     'id'       => 'foodshot',
            //     'type'     => 'checkbox',
            //     'title'    => __('Enable Foodshot', 'wordpress-stocks' ),
            //     'default'  => '0',
            // ),
            array(
                'id'       => 'pixabay',
                'type'     => 'checkbox',
                'title'    => __('Enable Pixabay', 'wordpress-stocks' ),
                'default'  => '0',
            ),
            array(
                'id'       => 'pixabayAppId',
                'type'     => 'text',
                'title'    => __('Pixabay App ID', 'woocommerce-store-locator'),
                'subtitle'  => 'Have no app id? Get it here: <a href="https://pixabay.com/api/docs/" target="_blank">https://pixabay.com/api/docs/</a>',
                'default'     => '4368596-b44c635808a077b0b551485ff',
                'required' => array('pixabay','equals','1'),
            ),
            
        )
    ) );

    Redux::setSection( $opt_name, array(
        'title'      => __( 'Advanced Settings', 'woocommerce-store-locator' ),
        'id'         => 'fields',
        'subsection' => true,
        'fields'     => array(
            array(
                'id'       => 'limit',
                'type'     => 'spinner',
                'title'    => __( 'Limit', 'woocommerce-store-locator' ),
                'subtitle' => __( 'How many images should be loaded per request. This will decrease the request amount you have.', 'woocommerce-store-locator' ),
                'default' => '3',
                'min'      => '3',
                'step'     => '1',
                'max'      => '999',
            ),
            array(
                'id'       => 'columns',
                'type'     => 'spinner',
                'title'    => __( 'Columns', 'woocommerce-store-locator' ),
                'subtitle' => __( 'How many images should be loaded per request. This will decrease the request amount you have.', 'woocommerce-store-locator' ),
                'default' => '6',
                'min'      => '1',
                'step'     => '1',
                'max'      => '12',
            ),
            array(
                'id'       => 'width',
                'type'     => 'spinner',
                'title'    => __( 'Image width', 'woocommerce-store-locator' ),
                'subtitle' => __( 'How many images should be loaded per request. This will decrease the request amount you have.', 'woocommerce-store-locator' ),
                'default' => '270',
                'min'      => '50',
                'step'     => '10',
                'max'      => '1000',
            ),
            array(
                'id'       => 'title',
                'type'     => 'text',
                'title'    => __( 'Image title text', 'woocommerce-store-locator' ),
                'subtitle' => __( 'Title text, that will be assigned to imported media.', 'woocommerce-store-locator' ),
                'default'     => 'Stock by %author% from %stock_site% Title',
            ),
            array(
                'id'       => 'caption',
                'type'     => 'text',
                'title'    => __( 'Image caption text', 'woocommerce-store-locator' ),
                'subtitle' => __( 'Caption text, that will be assigned to imported media.', 'woocommerce-store-locator' ),
                'default'     => 'Stock by %author% from %stock_site% Caption',
            ),
            array(
                'id'       => 'alt',
                'type'     => 'text',
                'title'    => __( 'Image alt text', 'woocommerce-store-locator' ),
                'subtitle' => __( 'Alternative text, that will be assigned to imported media.', 'woocommerce-store-locator' ),
                'default'     => 'Stock by %author% from %stock_site% Alt',
            ),
            array(
                'id'       => 'desc',
                'type'     => 'text',
                'title'    => __( 'Image description text', 'woocommerce-store-locator' ),
                'subtitle' => __( 'Descripion text, that will be assigned to imported media.', 'woocommerce-store-locator' ),
                'default'     => 'Stock by %author% from %stock_site% Desc',
            ),
        )
    ) );
    /*
     * <--- END SECTIONS
     */
