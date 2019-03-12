# Load the rails application
require File.expand_path('../application', __FILE__)

Thingspeak::Application.configure do
	config.action_controller.perform_caching = true
	config.cache_store = :file_store, "#{Rails.root}/tmp/cache"

	config.action_mailer.delivery_method = :smtp
	config.action_mailer.smtp_settings = {
		:enable_starttls_auto => true,
		:address => 'smtp.gmail.com',
		:port => 587,
		:domain => '54.183.168.205',
		:authentication => :plain,
		:user_name => 'abraginsky@gmail.com',
		:password => 'kmseipmpbmidrnov'
	}
end

# Initialize the rails application
Thingspeak::Application.initialize!
