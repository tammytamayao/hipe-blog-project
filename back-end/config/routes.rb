Rails.application.routes.draw do
  
  namespace :api do
    namespace :v1 do
      
      get '/posts', to: 'posts#index'
      get '/posts/:id', to: 'posts#show'
      post '/posts/create', to: 'posts#create'
      put '/posts/:id/edit', to: 'posts#update'
      delete '/posts/:id', to: 'posts#destroy'

      get '/posts/:post_id/comments', to: 'comments#index'
      get '/posts/:post_id/comments/:id', to: 'comments#show'
      post '/posts/:post_id/comments/create', to: 'comments#create'
      put '/posts/:post_id/comments/:id/edit', to: 'comments#update'
      delete '/posts/:post_id/comments/:id', to: 'comments#destroy'

      post '/posts/:post_id/likers/create', to: 'likers#create'
      get '/posts/:post_id/likers/show', to: 'likers#show'
      put '/posts/:post_id/likers/:id/destroy', to: 'likers#destroy'

      post 'users/register', to: 'users#register'
      post 'users/login', to: 'users#login'
      get '/users/activation/:token', to: 'users#activation'
      post '/users/getuserdata/', to: 'users#getuserdata'
      post '/users/getuserjwt/', to: 'users#getuserjwt'
      post '/users/requirejwt/', to: 'users#requirejwt'
      get '/users/token_expired/', to: 'users#token_expired'
      
      get '/search/posts/:keyword', to: 'search#posts'
      get '/search/users/:keyword', to: 'search#users'

    end
  end

  #get '/*path' => 'homepage#index'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  # Defines the root path route ("/")
  # root "articles#index"

  root 'api/v1/posts#index'
end
