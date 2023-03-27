class Api::V1::PostsController < ApplicationController
  before_action :requirejwt, only: [:index]
  before_action :decode_token, except: [:destroy]
  before_action :set_post, only: [:show, :update, :destroy]

  def index
    @posts = Post.where(user_id: @current_user.id)
    render json: @posts
  end

  def show
    render json: @post
  end

  def create
    if params[:title].length() == 0 || params[:body].length() == 0
      render :json => {:response => "complete the required fields"}
      return
    end
    
    existsImage = params[:image].presence
    if (existsImage != nil) 
      post = DataFile.save( params[:image], @current_user.email)
      if (post == "Image must not be greater than 2MB")
        render :json => {:response => "Image must not be greater than 2MB"}
        return
      end
      @post = Post.create!(title: params[:title], body: params[:body], user_id: @current_user.id, image_url: post)
    else
      @post = Post.create!(title: params[:title], body: params[:body], user_id: @current_user.id)
    end

    if @post
      render json: @post 
    else
      render json: @post.errors
    end
  end
  

  def update
    if params[:title].length() == 0 || params[:body].length() == 0
      render :json => {:response => "complete the required fields"}
      return
    end

    existsImage = params[:image].presence

    if (existsImage != nil) 
      post = DataFile.save( params[:image], @current_user.email)
      if (post == "Image must not be greater than 2MB")
        render :json => {:response => "Image must not be greater than 2MB"}
        return
      end
      @post = Post.update(title: params[:title], body: params[:body], user_id: @current_user.id, image_url: post)
    else
      @post = Post.update(title: params[:title], body: params[:body], user_id: @current_user.id)
    end
    
    if @post
     render json: { post: @post }
    else
      render json: @post.errors
    end
  end

  def destroy
    @post&.destroy
    render json: { message: 'Post deleted!' }
  end

  private

  def set_post
    @post ||= Post.find(params[:id])
  end

  def post_params
    params.require(:post).permit(:title, :body, :user_id)
  end

end
