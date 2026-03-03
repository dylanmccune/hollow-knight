cat /dev/null > Build/hktruffled.data  # This clears/creates the file
for i in {1..45}; do
  echo Processing $i/45
  cat "Build/hktruffled.data.part$i" >> Build/hktruffled.data
done
