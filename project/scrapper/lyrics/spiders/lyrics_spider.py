import scrapy

class QuotesSpider(scrapy.Spider):
    name = "lyrics"

    def start_requests(self):
        with open('urls', 'r') as url_file:
            for line in url_file:
                line = line.strip()
                index, url = line.split(' ')
                request = scrapy.Request(url=url, callback=self.parse)
                request.meta['index'] = index
                yield request

    def parse(self, response):
        for lyrics in response.css('div.lyrics'):
            index = response.meta['index']
            yield {index : ''.join(lyrics.css('p').select('text()').extract()).replace('\n', ' ')}

