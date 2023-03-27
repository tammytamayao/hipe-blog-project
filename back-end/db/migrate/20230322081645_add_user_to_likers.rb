class AddUserToLikers < ActiveRecord::Migration[7.0]
  def change
    add_reference :likers, :user, null: false, foreign_key: true
  end
end
