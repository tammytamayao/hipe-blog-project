class AddTokenAndTokenExpirationColumnsToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :token_expiration, :datetime
    add_column :users, :token, :string
  end
end
