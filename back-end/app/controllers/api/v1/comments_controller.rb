class Api::V1::CommentsController < ApplicationController
  before_action :requirejwt, only: [:index]
  before_action :decode_token, except: [:destroy]
  before_action :set_post
  before_action :set_comment, only: [:show, :update, :destroy]
  
    def index
        @comments = @post.comments
        render json: @comments
    end

    def show
      render json: @comment
    end
  
    def create
      @comment = @post.comments.create!(comment_params)
      if @comment
        render json: @comment 
      else
        render json: @comment.errors
      end
    end
  
    def update
      if @comment.update(comment_params)
        render json: { post: @comment }
      else
        render json: @comment.errors
      end
    end
  
    def destroy
      @comment = @post.comments.find(params[:id])
      @comment&.destroy
      render json: { message: 'Comment deleted!' }
    end
  
    private
    def set_post
      @post ||= Post.find(params[:post_id])
    end

    def set_comment
      @comment = @post.comments.find(params[:id])
    end
  
    def comment_params
        params.require(:comment).permit(:body, :user_id)
    end

end
