#
# lion execute file
#
rm ../lion.nw
echo "Running lion from $PWD"
zip -r ../lion.nw * > tmp.log
../nw ../lion.nw > nw.log
rm tmp.log
exit 0