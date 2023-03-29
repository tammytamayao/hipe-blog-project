class CreateSharedPosts < ActiveRecord::Migration[7.0]
  def change
    create_table :shared_posts do |t|
      t.integer :user_id, null: false
      t.integer :post_id, null: false
      t.text :description

      t.datetime :created_at
    end
  end
end
