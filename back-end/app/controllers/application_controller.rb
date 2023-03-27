class ApplicationController < ActionController::Base
    protect_from_forgery unless: -> { request.format.json? }

    def requirejwt
        token = request.headers["Authorization"]
        token.gsub!('Bearer ','')
        if !token
          head :forbidden
        end
        if !valid_token(token)
          head :forbidden
        end
      end
    
    def valid_token(token)
        jwt_secret = ENV['JWT_SECRET']
        unless token
          return false
        end
        token.gsub!('Bearer ','')
        begin
          decoded_token = JWT.decode token, jwt_secret, true
          Rails.logger.warn "Valid token"
          return true
        rescue JWT::DecodeError
          Rails.logger.warn "Invalid token"
        end
        false
    end
    
    def decode_token
      token = request.headers["Authorization"]
      token.gsub!('Bearer ','')
      
      jwt_secret = ENV['JWT_SECRET']
      user_token = JWT.decode(token, jwt_secret, algorithm: 'HS256')
      user_email = user_token[0]['email']
      @current_user = User.find_by_email(user_email)
    end
    
end
