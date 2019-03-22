Thingspeak::Application.configure do
  # Settings specified here will take precedence over those in config/environment.rb

  config.hostname = "localhost"
  config.port = "8080"

  # required by devise
  config.action_mailer.default_url_options = { :host => 'localhost:3000' }

  # In the development environment your application's code is reloaded on
  # every request.  This slows down response time but is perfect for development
  # since you don't have to restart the webserver when you make code changes.
  config.cache_classes = false

  config.eager_load = false

  # This allows you to see changes without having to precompile the assets again.
  # https://guides.rubyonrails.org/asset_pipeline.html
  # without this change, jquery gets imported twice? 20190322
  #
  # must run `RAILS_ENV=development rake assets:precompile` so that the files
  # are created under public/dev-assets
  config.assets.prefix = "/dev-assets"

  # Any changes to assets need to be compiled:
  # RAILS_ENV=development rake assets:precompile
  # RAILS_ENV=production rake assets:precompile
  #
  # Compiled assets get put under public/assets/*

  # NEW
  #config.assets.compile = true
  # dont set debug to true if compile is true
  # this fixes the jquery already loaded error! 20190322
  #config.assets.debug = false
  #config.assets.digest = true

  config.assets.debug = true

  # Show full error reports and disable caching
  config.consider_all_requests_local       = true
  config.action_controller.perform_caching = false

  # Don't care if the mailer can't send
  config.action_mailer.raise_delivery_errors = true

  # Print deprecation notices to the Rails logger
  config.active_support.deprecation = :log


end

