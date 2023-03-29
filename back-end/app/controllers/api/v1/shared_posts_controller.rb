class Api::V1::SharedPostsController < ApplicationController
    before_action :requirejwt, only: [:index]
    before_action :decode_token, except: [:destroy]
    before_action :set_shared_post, only: [:show, :update, :destroy]

    def index
        @shared_posts = SharedPost.where(user_id: @current_user.id)
        render json: @shared_posts
    end


    def create        
        @shared_posts = SharedPost.create(user_id: @current_user.id, post_id: params[:post_id], description: params[:description])
    
        if @shared_posts
          render json: @shared_posts 
        else
          render json: @shared_posts.errors
        end
    end

    def update
        
        @shared_posts = SharedPost.where(id: params[:id]).update(user_id: @current_user.id, post_id: params[:post_id], description: params[:description])
        if @shared_posts
          render json: @shared_posts 
        else
          render json: @shared_posts.errors
        end
    end

    def destroy
        @shared_posts&.destroy
        render json: { response: 'deleted' }
    end

    def set_shared_post
        @shared_posts ||= SharedPost.find(params[:id])
    end
 
end
