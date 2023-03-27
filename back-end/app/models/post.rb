class Post < ApplicationRecord

    has_many :comments, dependent: :destroy
    has_many :likers, dependent: :destroy
    belongs_to :user

    validates :title, presence: true, uniqueness: true, length: { minimum: 1, maximum: 140}
    validates :body, presence: true
    
end
