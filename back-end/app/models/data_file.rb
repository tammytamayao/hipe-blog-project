require "digest"

class DataFile < ActiveRecord::Base
    def self.save(upload, uploader)
        file_name = upload.original_filename  if  (upload !='')    
        file = upload.read    
        
        file_type = file_name.split('.').last
        new_name_file = uploader + Time.now.to_i.to_s
        en_name = Digest::MD5.hexdigest(new_name_file)
        new_file_name_with_type = "#{en_name}." + file_type

        if file.size > 2.megabytes
            return "Image must not be greater than 2MB"
        end

        image_root = "posts/attachments"

        File.open("public/files/" + image_root + "/" + new_file_name_with_type, "wb")  do |f|  
            f.write(file) 
        end

        return image_root + "/" + new_file_name_with_type
    end

 end
 

 