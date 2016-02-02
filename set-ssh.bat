ssh-agent -s
sleep 1
eval $(ssh-agent -s)
sleep 1
ssh-add ~/.ssh/id_rsa1