class Api::V1::SearchController < ApplicationController
    before_action :requirejwt, only: [:index]
    before_action :decode_token, except: [:destroy]
    before_action :set_post, only: [:show, :update, :destroy]
  
    def posts
      key = "%#{params[:keyword]}%"
      @posts = Post.where("lower(title) LIKE ? or lower(body) LIKE ?", key.downcase, key.downcase)
      render json: @posts
    end

    def users
        key = "%#{params[:keyword]}%"
        @users = User.select('id, email, first_name, middle_name, last_name' ).where("lower(first_name) LIKE ? or lower(middle_name) LIKE ? or lower(last_name) LIKE ?", key.downcase, key.downcase, key.downcase)
        render json: @users
    end

  end
  