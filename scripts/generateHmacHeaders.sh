#!/bin/bash

# For convenience, you can generate headers via bash. 
# Note that this just invokes the node script.

# examples
#
# no date
# 
# generate.sh some-key some-secret
# 
#
# with optional date
# 
# generate.sh some-key some-secret 'Fri, 04 Oct 2019 15:10:53 EDT'
# 


if [ -z "$3" ]
then npm run generate-headers -- -k $1 -s $2
else npm run generate-headers -- -k $1 -s $2 -d "$3"
fi