const fetch = require('node-fetch');

let url = 'https://www.warcraftlogs.com/api/v2/';
const name = "brÔoklyn"
const realm = "Illidan"
const charQuery = `
    {
        characterData{
            character(name: "${name}", serverSlug: "${realm}", serverRegion: "us") {
                id
                canonicalID
                level
                name
                server
                {
                    name
                }
                classID
                faction {
                    id
                    name
                }
                zoneRankings			
            }
        }
    }
`

let options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NmM5ZDIwMi0yYjE0LTQ0MDctYTQ3ZS0yNGQzODUxZWU5MmIiLCJqdGkiOiJkMGE5N2IwYTRkMTAzMDc5YzZmNTEwOGYzMTYxNTU2MzkzZDA3MWZiMjhkNDE4ZGRjZjFiNjQyNGJiYTAyOWI4ZTFiYTM5ZWM3YjE5OWE2NyIsImlhdCI6MTY1Nzk5MjE2OS44NjkyOTksIm5iZiI6MTY1Nzk5MjE2OS44NjkzMDMsImV4cCI6MTY4OTA5NjE2OS44NjA1NDIsInN1YiI6IjExOTg1MTMiLCJzY29wZXMiOlsidmlldy11c2VyLXByb2ZpbGUiLCJ2aWV3LXByaXZhdGUtcmVwb3J0cyJdfQ.Kpp3YF5X0IEQImq4j-7o-akGjS8M6nXqFaTkNPRS7z2JFddtHOuabUzsF1SK21m2iArkVLawTO5t_FJuxyN4WFNJFOPJ9ld0RirGAKP6PHvPL4K-t9cAWx53U1ECewPMiK_Iu9fUrSYQDuJ377mTIllu-JBR99ltq0RkmnxcyrUX7JdKdeiTuTCy-0Zp4Vx8YmXN32R0YqD8tYFy6a3JLORit9sZnz_Ticp4sLHRGt7h4JQet9ubHqPy1F-CdoJ6hU0arNQmzS3xywGXx5eu2jlZ0blH3XWMz_9iPmQUKqaIYpKAVx-SV88Y22Bfb-vxACZeceTZSRiZV8KlJSGLHxqvOfP64kfTbYQWhBVTlAfqB31eU1fkZ1qIiDz5RAcRyb5UgOCIJelri_3H1TapTrv6NWngbOP0e6k_j_iwUu6RSnsnjmVD9JEpHnaiZxPAVxD-DkyxDQsiBJFFYGb-R-4qRinfN1FlAiO2VQhMYZRJcaI-x7xfXhw8N8DKN7OlbQypZDCaPbMkhCPXlBYwTmJjd6H3yRVkUvGfvoNj3XyAmXzjKAUZzpezaQubGjTELYIs4U8743MmGvKaOz3V97eObr87SGw5ONax0F0h2wc1u-2MJHzfBLjwgropD7-hwMwz0aIIcOm_AicKAwsC6jbcRJ8rivFDDvjMSHMQ8qA'
  },
  body: JSON.stringify({query:charQuery}) 
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json.data.characterData.character.zoneRankings.rankings))
  .catch(err => console.error('error:' + err));