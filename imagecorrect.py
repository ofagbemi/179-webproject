images = list()
with open('images.txt', 'r') as f:
  images = f.readlines()

num = 0
with open('fixedimages.txt', 'w') as f:
  for image in images:
    with_id = image[:22] + ' id="img' + str(num) +'" ' + image[23:]
    link = '<a href="#" class="stage_term"></a>'
    f.write('<div class="stage">' + link + with_id.strip()[:22] + 
            ' onerror="this.src=\'images/noimg.jpg\';" ' + 
            with_id.strip()[23:] + '</div>\n')
    num += 1