<?php

/**
 * The plugin bootstrap file
 *
 *
 * @link              http://woocommerce.db-dzine.com
 * @since             1.0.0
 * @package           Wordpress_Stocks
 *
 * @wordpress-plugin
 * Plugin Name:       Wordpress Stocks
 * Plugin URI:        http://woocommerce.db-dzine.com
 * Description:       Easy Stocks Wordpress Plugin
 * Version:           1.0.0
 * Author:            DB-Dzine
 * Author URI:        http://www.db-dzine.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       wordpress-stocks
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-wordpress-stocks-activator.php
 */
function activate_Wordpress_Stocks() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-wordpress-stocks-activator.php';
	$Wordpress_Stocks_Activator = new Wordpress_Stocks_Activator();
	$Wordpress_Stocks_Activator->activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-wordpress-stocks-deactivator.php
 */
function deactivate_Wordpress_Stocks() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-wordpress-stocks-deactivator.php';
	Wordpress_Stocks_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_Wordpress_Stocks' );
register_deactivation_hook( __FILE__, 'deactivate_Wordpress_Stocks' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-wordpress-stocks.php';

/**
 * Run the Plugin
 * @author Daniel Barenkamp
 * @version 1.0.0
 * @since   1.0.0
 * @link    http://woocommerce.db-dzine.com
 */
function run_Wordpress_Stocks() {

	$plugin = new Wordpress_Stocks();
	$plugin->run();

}

include_once( ABSPATH . 'wp-admin/includes/plugin.php' );
// Load the TGM init if it exists
if ( file_exists( plugin_dir_path( __FILE__ ) . 'admin/tgm/tgm-init.php' ) ) {
    require_once plugin_dir_path( __FILE__ ) . 'admin/tgm/tgm-init.php';
}

if ( is_plugin_active('redux-framework/redux-framework.php')) {
	run_Wordpress_Stocks();
} else {
	add_action( 'admin_notices', 'Wordpress_Stocks_Not_Installed' );
}

function Wordpress_Stocks_Not_Installed()
{
	?>
    <div class="error">
      <p><?php _e( 'Wordpress Stocks requires the free Redux Framework plugin. Please install or activate them before!', 'wordpress-stocks'); ?></p>
    </div>
    <?php
}
