#
# lion execute file
#
echo "Running lion in $PWD..."
zip -r ../lion.nw * > tmp.log
../nw ../lion.nw > nw.log
rm tmp.log
exit 0