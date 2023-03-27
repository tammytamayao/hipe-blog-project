class Api::V1::LikersController < ApplicationController
    before_action :decode_token, except: [:destroy]
    before_action :set_post

    def create
      if is_liked?
        @like = @post.likers.where(user_id: params[:user_id], post_id:params[:post_id])
        render :json => {:result => "liked", :likeData => @like}
      else 
        @like = @post.likers.create!(liker_params)
        update(@post)
        render json: @post if @like
      end
    end

    def destroy
      if is_liked?
        @like = @post.likers.find(params[:id])
        @like.destroy
        update(@post)
        render json: @like
      else
        render :json => {:result => "cannot be unliked"}
      end
    end

    def update(post)
      @like_count = post.likers.count
      @post.update(likes: @like_count)
    end

    private

    def set_post
      @post ||= Post.find(params[:post_id])
    end

    def liker_params
      params.require(:liker).permit(:user_id,:post_id)
    end

    def is_liked?
      Liker.where(user_id: params[:user_id], post_id:params[:post_id]).exists?
    end

end
