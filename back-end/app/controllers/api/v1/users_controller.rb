require 'date'
require 'jwt'

class Api::V1::UsersController < ApplicationController
    #def index
    #    @users = User.all
    #    render json: @users
    #end

    def register
        
        if params[:first_name].length() == 0 || params[:middle_name].length() == 0 || params[:last_name].length() == 0
            render :json => {:response => "complete the required fields"}
        elsif params[:password].length() < 8
            render :json => {:response => "password must atleast be 8 characters"}
        elsif params[:password] != params[:password_confirmation]
            render :json => {:response => "password didn't match"}
        elsif User.exists?(email: params[:email])
            render :json => {:response => "email already taken"}
        else 
            
            random_token = SecureRandom.urlsafe_base64(nil, false)
            token_exp = DateTime.now.advance(minutes: 120)    
            
            body = "Verify your account by clicking on this link " + ENV["URL_REACT"] + "verify/"+random_token+" before " + token_exp.strftime("%d/%B/%Y %I:%M%p")
            @users = User.create(email: params[:email], password_digest: BCrypt::Password.create(params[:password]), token_expiration: token_exp ,token: random_token, first_name: params[:first_name], middle_name: params[:middle_name], last_name: params[:last_name])
            if @users
                render :json => {:response => "registration successful"}
                ActionMailer::Base.mail(from: "Rails Blog App", to: params[:email], subject: "Account Verification", body: body).deliver

            else
                render json: @users.errors
                render :json => {:response => "registration failed"}
            end
            
        end
    end

        
    def activation
        ca = User.find_by_token(params[:token])
        
        token_exp = ca.token_expiration
        time_now = DateTime.now
        if token_exp >= time_now
            #render :json => {:response => "email verified"}
            @userUpdate = User.find_by_token(params[:token])
            if @userUpdate.update(confirmed_at: time_now)
                render :json => {:response => "email verified"}
            else
                render json: @userUpdate.errors
            end
        else
            render :json => {:response => "token expired"}
        end

    end





    def login

        ca = User.find_by_email(params[:email])
        #cb = User.find_by_password_digest('')
        #logger.info("Logs" + ca.password_digest)
        #if User.where(:id => (ca.id & cb.id))

        begin            
            if BCrypt::Password.new(ca.password_digest) === BCrypt::Engine.hash_secret(params[:password], ca.password_digest)  
                #render :json => {:response => "authenticated" }
                if ca.confirmed_at === nil
                    render :json => {:response => "email confirmation required" }
                else
                    render :json => {:response => "authenticated", :token => getuserjwt(params[:email]) }
                end
            else 
                render :json => {:response => "log in failed"}
            end
        rescue Exception => e
            render :json => {:response => "log in failed"}
        end
        
    end

    
    def getuserdata
        ca = User.find_by_email(params[:email])
        
        user_id = ca.id
        user_created = ca.created_at
        first_name = ca.first_name
        middle_name = ca.middle_name
        last_name = ca.last_name
        
        render :json => {:user_id => user_id, :user_created => user_created, :first_name => first_name, :middle_name => middle_name, :last_name => last_name }
    end


    
    def getuserjwt(email)
        ca = User.find_by_email(email)
        
        user_id = ca.id
        user_created = ca.created_at
        first_name = ca.first_name
        middle_name = ca.middle_name
        last_name = ca.last_name

        expiry = (2).minutes.from_now.to_i
        payload = { :user_id => user_id,  email: email, :user_created => user_created, :first_name => first_name, :middle_name => middle_name, :last_name => last_name, :expiry => expiry }

        hmac_secret = ENV['JWT_SECRET']
        token = JWT.encode payload, hmac_secret, 'HS256'
        jwt = token

        #render :json => {:token => jwt }

        return jwt
    end

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

    
    def token_expired
        token = request.headers["Authorization"]
        token.gsub!('Bearer ','')
        
        if !token
          head :forbidden
        end
        if !valid_token(token)
          head :forbidden
        end

        jwt_secret = ENV['JWT_SECRET']
        user_token = JWT.decode(token, jwt_secret, algorithm: 'HS256')
        token_expiration = user_token[0]['expiry']
        email = user_token[0]['email']
        currentTime = Time.now.to_f
        if currentTime > token_expiration
            render :json => {:response => "expired", :new_token => getuserjwt(email) }
        else
            render :json => {:response => "active" }
        end

    end
    
    private
    
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

end


