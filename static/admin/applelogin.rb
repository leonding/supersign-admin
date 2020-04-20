require "spaceship"
require 'pathname'

username = ARGV[0]
pwd = ARGV[1]
Spaceship::Portal.login(username, pwd)