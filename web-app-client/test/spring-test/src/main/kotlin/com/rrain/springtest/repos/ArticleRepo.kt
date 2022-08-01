package com.rrain.springtest.repos

import com.rrain.springtest.entities.Image
import com.rrain.springtest.entities.article.Article
import com.rrain.springtest.entities.article.ArticleImage
import java.util.*
import java.util.concurrent.atomic.AtomicInteger


/*
todo:
    Image {
        articleId
        localId
        imageId
    }

    <img src="localId=123" />

    front:
    Image {
        localId
        file
        url
    }
 */

object ArticleRepo {

    val images = Collections.synchronizedMap(mutableMapOf(
        1 to Image(1, "FlatOut 2.jpg"),
        2 to Image(2, "NEXT UP.jpg"),
        3 to Image(3, "Our Last Night.jpg"),
        4 to Image(4, "Retrowave (1).png"),
    ))
    val nextImageId = AtomicInteger((images.keys.maxOrNull() ?: 0) + 1)

    // articleId to ArticleImage
    val articleImages = Collections.synchronizedMap(mutableMapOf(
        1 to listOf(ArticleImage(1, 1, 1)),
        2 to listOf(ArticleImage(2, 1, 2), ArticleImage(2, 2, 1)),
        3 to listOf(ArticleImage(3, 1, 3), ArticleImage(3, 2, 1)),
        4 to listOf(ArticleImage(4, 1, 4)),
    ))
    //val nextArticleImageId = AtomicInteger((articleImages.keys.maxOrNull() ?: 0) + 1)

    val articles = Collections.synchronizedMap(mutableMapOf(
        1 to Article(
            1,
            "Статья 1", 1,
            "LoremTheme", "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            "2022-01-01T00:00", mutableListOf("музей","отдых","история","наука"),
            "Автор 1", "Фотограф 1",
            """
                |<h3>Lorem</h3>
                |Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce consectetur porta augue, vitae volutpat enim molestie ut. Suspendisse ut mollis lorem, at efficitur sapien. Integer lectus erat, pharetra quis venenatis sit amet, dapibus eget nunc. Etiam condimentum elit consectetur pharetra efficitur. Ut rhoncus laoreet commodo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Etiam semper lectus tellus, non pretium massa sodales vel. Maecenas pellentesque sapien odio, sit amet ullamcorper ex venenatis ut. Suspendisse potenti. Quisque faucibus consectetur nisi. Morbi consequat faucibus leo. Morbi consectetur purus aliquet erat accumsan, non mattis enim imperdiet. Fusce sagittis nulla vitae nibh scelerisque, vitae suscipit lectus vulputate. Aenean velit lacus, fermentum vitae velit in, aliquam dictum turpis.
                |Curabitur dapibus euismod mollis. Nullam eu mauris id quam rutrum bibendum. Proin blandit venenatis risus vitae cursus. Morbi ultrices felis finibus risus ullamcorper, ut interdum purus finibus. Pellentesque non massa at ex euismod laoreet. Nunc et aliquam nisl, sit amet faucibus velit. Aliquam ultrices nec arcu at vestibulum. Mauris ut est tincidunt, posuere purus quis, pretium tortor. Cras ut lectus libero. Integer eget pellentesque diam. Phasellus mauris tortor, euismod eu luctus id, viverra id ipsum. Vestibulum efficitur augue non condimentum congue. Proin vulputate lorem eget vehicula feugiat. Nullam tempus congue finibus. Integer faucibus, mauris at consequat scelerisque, quam eros tristique sem, at vehicula ipsum felis quis enim. Curabitur dictum facilisis ligula, a vehicula quam.
                |<h3>Ipsum</h3>
                |Vivamus ornare finibus ligula, id posuere quam blandit sit amet. Nam sodales ipsum ut est viverra, id viverra magna dictum. Pellentesque mollis sollicitudin lacus nec fermentum. Nullam iaculis et odio id condimentum. Phasellus aliquam ut neque a feugiat. Vivamus arcu mauris, auctor vel aliquet id, consequat eget lectus. Fusce convallis sodales ante in elementum.
                |Nulla ultricies tortor eget ex sagittis, ut semper mi aliquam. In porta massa enim, et rutrum mauris suscipit accumsan. Ut feugiat leo metus, at tempus odio suscipit eu. Nunc et diam interdum, dictum dui id, maximus risus. Morbi sagittis, dolor nec pulvinar tempor, lectus mi vestibulum nunc, vel euismod tortor turpis vitae odio. Praesent id turpis in purus fermentum ornare. Cras non turpis malesuada, auctor turpis vitae, pretium magna. Donec lobortis, massa vel ultrices gravida, ligula turpis ullamcorper magna, eu imperdiet arcu leo ut turpis. Nam pharetra nunc luctus enim faucibus sodales et eget ante. Pellentesque vitae pellentesque sapien. Nulla facilisi. Curabitur congue pretium tristique. Ut lacus orci, ultricies vel orci quis, aliquet dapibus ante. Duis lacinia quis nisi ut porta. Nullam lacinia dolor non justo tempor rutrum. Duis auctor euismod orci ac sagittis.
                |Etiam ligula nibh, tempus eget felis ut, euismod ultrices turpis. Ut ut elit enim. Morbi erat ex, ornare vel scelerisque at, convallis eget augue. Curabitur faucibus nulla mi, ut ultricies risus ultrices id. Nullam tempor tincidunt convallis. Proin vestibulum orci non tincidunt posuere. Duis tincidunt, odio porta pretium vehicula, quam nibh bibendum sem, ac malesuada lectus lectus et felis. Morbi rhoncus sed quam vitae maximus. Duis volutpat lorem lorem, quis consequat velit mattis pulvinar. Nullam nec arcu non nibh viverra elementum eget tristique est. Donec rutrum urna quis vulputate porttitor. Curabitur gravida tellus non tortor sollicitudin malesuada. Ut ac sem condimentum, congue enim ac, pellentesque urna. Integer bibendum sed nisi ac volutpat.
            """.trimMargin(),
            mutableListOf(5),
            5, true,
        ),
        2 to Article(
            2,
            "Статья 2 - Lorem ipsum dolor sit amet, consectetur adipiscing elit", 1,
            "LoremTheme","Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce consectetur porta augue",
            "2022-01-10T00:00", mutableListOf("tag1","tag2","tag3"),
            "Автор 1", "Фотограф 1",
            """
                |<h3>Lorem</h3>
                |Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce consectetur porta augue, vitae volutpat enim molestie ut. Suspendisse ut mollis lorem, at efficitur sapien. Integer lectus erat, pharetra quis venenatis sit amet, dapibus eget nunc. Etiam condimentum elit consectetur pharetra efficitur. Ut rhoncus laoreet commodo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Etiam semper lectus tellus, non pretium massa sodales vel. Maecenas pellentesque sapien odio, sit amet ullamcorper ex venenatis ut. Suspendisse potenti. Quisque faucibus consectetur nisi. Morbi consequat faucibus leo. Morbi consectetur purus aliquet erat accumsan, non mattis enim imperdiet. Fusce sagittis nulla vitae nibh scelerisque, vitae suscipit lectus vulputate. Aenean velit lacus, fermentum vitae velit in, aliquam dictum turpis.
                |Curabitur dapibus euismod mollis. Nullam eu mauris id quam rutrum bibendum. Proin blandit venenatis risus vitae cursus. Morbi ultrices felis finibus risus ullamcorper, ut interdum purus finibus. Pellentesque non massa at ex euismod laoreet. Nunc et aliquam nisl, sit amet faucibus velit. Aliquam ultrices nec arcu at vestibulum. Mauris ut est tincidunt, posuere purus quis, pretium tortor. Cras ut lectus libero. Integer eget pellentesque diam. Phasellus mauris tortor, euismod eu luctus id, viverra id ipsum. Vestibulum efficitur augue non condimentum congue. Proin vulputate lorem eget vehicula feugiat. Nullam tempus congue finibus. Integer faucibus, mauris at consequat scelerisque, quam eros tristique sem, at vehicula ipsum felis quis enim. Curabitur dictum facilisis ligula, a vehicula quam.
                |<h3>Ipsum</h3>
                |Картинки
                |<article-image localId="2" />
                |Vivamus ornare finibus ligula, id posuere quam blandit sit amet. Nam sodales ipsum ut est viverra, id viverra magna dictum. Pellentesque mollis sollicitudin lacus nec fermentum. Nullam iaculis et odio id condimentum. Phasellus aliquam ut neque a feugiat. Vivamus arcu mauris, auctor vel aliquet id, consequat eget lectus. Fusce convallis sodales ante in elementum.
                |Nulla ultricies tortor eget ex sagittis, ut semper mi aliquam. In porta massa enim, et rutrum mauris suscipit accumsan. Ut feugiat leo metus, at tempus odio suscipit eu. Nunc et diam interdum, dictum dui id, maximus risus. Morbi sagittis, dolor nec pulvinar tempor, lectus mi vestibulum nunc, vel euismod tortor turpis vitae odio. Praesent id turpis in purus fermentum ornare. Cras non turpis malesuada, auctor turpis vitae, pretium magna. Donec lobortis, massa vel ultrices gravida, ligula turpis ullamcorper magna, eu imperdiet arcu leo ut turpis. Nam pharetra nunc luctus enim faucibus sodales et eget ante. Pellentesque vitae pellentesque sapien. Nulla facilisi. Curabitur congue pretium tristique. Ut lacus orci, ultricies vel orci quis, aliquet dapibus ante. Duis lacinia quis nisi ut porta. Nullam lacinia dolor non justo tempor rutrum. Duis auctor euismod orci ac sagittis.
                |Etiam ligula nibh, tempus eget felis ut, euismod ultrices turpis. Ut ut elit enim. Morbi erat ex, ornare vel scelerisque at, convallis eget augue. Curabitur faucibus nulla mi, ut ultricies risus ultrices id. Nullam tempor tincidunt convallis. Proin vestibulum orci non tincidunt posuere. Duis tincidunt, odio porta pretium vehicula, quam nibh bibendum sem, ac malesuada lectus lectus et felis. Morbi rhoncus sed quam vitae maximus. Duis volutpat lorem lorem, quis consequat velit mattis pulvinar. Nullam nec arcu non nibh viverra elementum eget tristique est. Donec rutrum urna quis vulputate porttitor. Curabitur gravida tellus non tortor sollicitudin malesuada. Ut ac sem condimentum, congue enim ac, pellentesque urna. Integer bibendum sed nisi ac volutpat.
            """.trimMargin(),
            mutableListOf(5,5),
            50, false
        ),
        3 to Article(
            3,
            "Статья 3", 1,
            "LoremTheme","Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            "2022-01-22T00:00", mutableListOf("музей","отдых","история","наука"),
            "Автор 1", "Фотограф 1",
            """
                |<h3>Lorem</h3>
                |Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce consectetur porta augue, vitae volutpat enim molestie ut. Suspendisse ut mollis lorem, at efficitur sapien. Integer lectus erat, pharetra quis venenatis sit amet, dapibus eget nunc. Etiam condimentum elit consectetur pharetra efficitur. Ut rhoncus laoreet commodo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Etiam semper lectus tellus, non pretium massa sodales vel. Maecenas pellentesque sapien odio, sit amet ullamcorper ex venenatis ut. Suspendisse potenti. Quisque faucibus consectetur nisi. Morbi consequat faucibus leo. Morbi consectetur purus aliquet erat accumsan, non mattis enim imperdiet. Fusce sagittis nulla vitae nibh scelerisque, vitae suscipit lectus vulputate. Aenean velit lacus, fermentum vitae velit in, aliquam dictum turpis.
                |Curabitur dapibus euismod mollis. Nullam eu mauris id quam rutrum bibendum. Proin blandit venenatis risus vitae cursus. Morbi ultrices felis finibus risus ullamcorper, ut interdum purus finibus. Pellentesque non massa at ex euismod laoreet. Nunc et aliquam nisl, sit amet faucibus velit. Aliquam ultrices nec arcu at vestibulum. Mauris ut est tincidunt, posuere purus quis, pretium tortor. Cras ut lectus libero. Integer eget pellentesque diam. Phasellus mauris tortor, euismod eu luctus id, viverra id ipsum. Vestibulum efficitur augue non condimentum congue. Proin vulputate lorem eget vehicula feugiat. Nullam tempus congue finibus. Integer faucibus, mauris at consequat scelerisque, quam eros tristique sem, at vehicula ipsum felis quis enim. Curabitur dictum facilisis ligula, a vehicula quam.
                |<h3>Ipsum</h3>
                |<article-image localId="2" />
                |Vivamus ornare finibus ligula, id posuere quam blandit sit amet. Nam sodales ipsum ut est viverra, id viverra magna dictum. Pellentesque mollis sollicitudin lacus nec fermentum. Nullam iaculis et odio id condimentum. Phasellus aliquam ut neque a feugiat. Vivamus arcu mauris, auctor vel aliquet id, consequat eget lectus. Fusce convallis sodales ante in elementum.
                |Nulla ultricies tortor eget ex sagittis, ut semper mi aliquam. In porta massa enim, et rutrum mauris suscipit accumsan. Ut feugiat leo metus, at tempus odio suscipit eu. Nunc et diam interdum, dictum dui id, maximus risus. Morbi sagittis, dolor nec pulvinar tempor, lectus mi vestibulum nunc, vel euismod tortor turpis vitae odio. Praesent id turpis in purus fermentum ornare. Cras non turpis malesuada, auctor turpis vitae, pretium magna. Donec lobortis, massa vel ultrices gravida, ligula turpis ullamcorper magna, eu imperdiet arcu leo ut turpis. Nam pharetra nunc luctus enim faucibus sodales et eget ante. Pellentesque vitae pellentesque sapien. Nulla facilisi. Curabitur congue pretium tristique. Ut lacus orci, ultricies vel orci quis, aliquet dapibus ante. Duis lacinia quis nisi ut porta. Nullam lacinia dolor non justo tempor rutrum. Duis auctor euismod orci ac sagittis.
                |Etiam ligula nibh, tempus eget felis ut, euismod ultrices turpis. Ut ut elit enim. Morbi erat ex, ornare vel scelerisque at, convallis eget augue. Curabitur faucibus nulla mi, ut ultricies risus ultrices id. Nullam tempor tincidunt convallis. Proin vestibulum orci non tincidunt posuere. Duis tincidunt, odio porta pretium vehicula, quam nibh bibendum sem, ac malesuada lectus lectus et felis. Morbi rhoncus sed quam vitae maximus. Duis volutpat lorem lorem, quis consequat velit mattis pulvinar. Nullam nec arcu non nibh viverra elementum eget tristique est. Donec rutrum urna quis vulputate porttitor. Curabitur gravida tellus non tortor sollicitudin malesuada. Ut ac sem condimentum, congue enim ac, pellentesque urna. Integer bibendum sed nisi ac volutpat.
            """.trimMargin(),
            mutableListOf(6),
            1, false
        ),
        4 to Article(
            4,
            "Статья 4", 1,
            "LoremTheme","Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce consectetur porta augue",
            "2022-01-30T00:00", mutableListOf("музей","отдых","история","наука"),
            "Автор 1", "Фотограф 1",
            """
                |<h3>Lorem</h3>
                |Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce consectetur porta augue, vitae volutpat enim molestie ut. Suspendisse ut mollis lorem, at efficitur sapien. Integer lectus erat, pharetra quis venenatis sit amet, dapibus eget nunc. Etiam condimentum elit consectetur pharetra efficitur. Ut rhoncus laoreet commodo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Etiam semper lectus tellus, non pretium massa sodales vel. Maecenas pellentesque sapien odio, sit amet ullamcorper ex venenatis ut. Suspendisse potenti. Quisque faucibus consectetur nisi. Morbi consequat faucibus leo. Morbi consectetur purus aliquet erat accumsan, non mattis enim imperdiet. Fusce sagittis nulla vitae nibh scelerisque, vitae suscipit lectus vulputate. Aenean velit lacus, fermentum vitae velit in, aliquam dictum turpis.
                |Curabitur dapibus euismod mollis. Nullam eu mauris id quam rutrum bibendum. Proin blandit venenatis risus vitae cursus. Morbi ultrices felis finibus risus ullamcorper, ut interdum purus finibus. Pellentesque non massa at ex euismod laoreet. Nunc et aliquam nisl, sit amet faucibus velit. Aliquam ultrices nec arcu at vestibulum. Mauris ut est tincidunt, posuere purus quis, pretium tortor. Cras ut lectus libero. Integer eget pellentesque diam. Phasellus mauris tortor, euismod eu luctus id, viverra id ipsum. Vestibulum efficitur augue non condimentum congue. Proin vulputate lorem eget vehicula feugiat. Nullam tempus congue finibus. Integer faucibus, mauris at consequat scelerisque, quam eros tristique sem, at vehicula ipsum felis quis enim. Curabitur dictum facilisis ligula, a vehicula quam.
                |<h3>Ipsum</h3>
                |Vivamus ornare finibus ligula, id posuere quam blandit sit amet. Nam sodales ipsum ut est viverra, id viverra magna dictum. Pellentesque mollis sollicitudin lacus nec fermentum. Nullam iaculis et odio id condimentum. Phasellus aliquam ut neque a feugiat. Vivamus arcu mauris, auctor vel aliquet id, consequat eget lectus. Fusce convallis sodales ante in elementum.
                |Nulla ultricies tortor eget ex sagittis, ut semper mi aliquam. In porta massa enim, et rutrum mauris suscipit accumsan. Ut feugiat leo metus, at tempus odio suscipit eu. Nunc et diam interdum, dictum dui id, maximus risus. Morbi sagittis, dolor nec pulvinar tempor, lectus mi vestibulum nunc, vel euismod tortor turpis vitae odio. Praesent id turpis in purus fermentum ornare. Cras non turpis malesuada, auctor turpis vitae, pretium magna. Donec lobortis, massa vel ultrices gravida, ligula turpis ullamcorper magna, eu imperdiet arcu leo ut turpis. Nam pharetra nunc luctus enim faucibus sodales et eget ante. Pellentesque vitae pellentesque sapien. Nulla facilisi. Curabitur congue pretium tristique. Ut lacus orci, ultricies vel orci quis, aliquet dapibus ante. Duis lacinia quis nisi ut porta. Nullam lacinia dolor non justo tempor rutrum. Duis auctor euismod orci ac sagittis.
                |Etiam ligula nibh, tempus eget felis ut, euismod ultrices turpis. Ut ut elit enim. Morbi erat ex, ornare vel scelerisque at, convallis eget augue. Curabitur faucibus nulla mi, ut ultricies risus ultrices id. Nullam tempor tincidunt convallis. Proin vestibulum orci non tincidunt posuere. Duis tincidunt, odio porta pretium vehicula, quam nibh bibendum sem, ac malesuada lectus lectus et felis. Morbi rhoncus sed quam vitae maximus. Duis volutpat lorem lorem, quis consequat velit mattis pulvinar. Nullam nec arcu non nibh viverra elementum eget tristique est. Donec rutrum urna quis vulputate porttitor. Curabitur gravida tellus non tortor sollicitudin malesuada. Ut ac sem condimentum, congue enim ac, pellentesque urna. Integer bibendum sed nisi ac volutpat.
            """.trimMargin(),
            mutableListOf(),
            99, true
        ),
    ))
    val nextArticleId = AtomicInteger((articles.keys.maxOrNull() ?: 0) + 1)


}




private val withTags = """
                |<h3>Lorem</h3>
                |<p>Lorem ipsum <i>dolor</i> sit amet, consectetur <b>adipiscing</b> elit. <mark>Fusce</mark> consectetur porta augue, <i>vitae volutpat enim molestie ut.</i> <b>Suspendisse ut mollis lorem, at efficitur sapien.</b> <mark>Integer lectus erat, pharetra quis venenatis sit amet, dapibus eget nunc.</mark> Etiam condimentum elit consectetur pharetra efficitur. Ut rhoncus laoreet commodo. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Etiam semper lectus tellus, non pretium massa sodales vel. Maecenas pellentesque sapien odio, sit amet ullamcorper ex venenatis ut. Suspendisse potenti. Quisque faucibus consectetur nisi. Morbi consequat faucibus leo. Morbi consectetur purus aliquet erat accumsan, non mattis enim imperdiet. Fusce sagittis nulla vitae nibh scelerisque, vitae suscipit lectus vulputate. Aenean velit lacus, fermentum vitae velit in, aliquam dictum turpis.</p>
                |<p>Curabitur dapibus euismod mollis. Nullam eu mauris id quam rutrum bibendum. Proin blandit venenatis risus vitae cursus. Morbi ultrices felis finibus risus ullamcorper, ut interdum purus finibus. Pellentesque non massa at ex euismod laoreet. Nunc et aliquam nisl, sit amet faucibus velit. Aliquam ultrices nec arcu at vestibulum. Mauris ut est tincidunt, posuere purus quis, pretium tortor. Cras ut lectus libero. Integer eget pellentesque diam. Phasellus mauris tortor, euismod eu luctus id, viverra id ipsum. Vestibulum efficitur augue non condimentum congue. Proin vulputate lorem eget vehicula feugiat. Nullam tempus congue finibus. Integer faucibus, mauris at consequat scelerisque, quam eros tristique sem, at vehicula ipsum felis quis enim. Curabitur dictum facilisis ligula, a vehicula quam.</p>
                |<h3>Ipsum</h3>
                |<p>Картинки</p>
                |<article-image localId="2" />
                |<p class="image-description">Описание картинки. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce consectetur porta augue, vitae volutpat enim molestie ut. Suspendisse ut mollis lorem, at efficitur sapien.</p>
                |<p>Vivamus ornare finibus ligula, id posuere quam blandit sit amet. Nam sodales ipsum ut est viverra, id viverra magna dictum. Pellentesque mollis sollicitudin lacus nec fermentum. Nullam iaculis et odio id condimentum. Phasellus aliquam ut neque a feugiat. Vivamus arcu mauris, auctor vel aliquet id, consequat eget lectus. Fusce convallis sodales ante in elementum.</p>
                |<p>Nulla ultricies tortor eget ex sagittis, ut semper mi aliquam. In porta massa enim, et rutrum mauris suscipit accumsan. Ut feugiat leo metus, at tempus odio suscipit eu. Nunc et diam interdum, dictum dui id, maximus risus. Morbi sagittis, dolor nec pulvinar tempor, lectus mi vestibulum nunc, vel euismod tortor turpis vitae odio. Praesent id turpis in purus fermentum ornare. Cras non turpis malesuada, auctor turpis vitae, pretium magna. Donec lobortis, massa vel ultrices gravida, ligula turpis ullamcorper magna, eu imperdiet arcu leo ut turpis. Nam pharetra nunc luctus enim faucibus sodales et eget ante. Pellentesque vitae pellentesque sapien. Nulla facilisi. Curabitur congue pretium tristique. Ut lacus orci, ultricies vel orci quis, aliquet dapibus ante. Duis lacinia quis nisi ut porta. Nullam lacinia dolor non justo tempor rutrum. Duis auctor euismod orci ac sagittis.</p>
                |<p>Etiam ligula nibh, tempus eget felis ut, euismod ultrices turpis. Ut ut elit enim. Morbi erat ex, ornare vel scelerisque at, convallis eget augue. Curabitur faucibus nulla mi, ut ultricies risus ultrices id. Nullam tempor tincidunt convallis. Proin vestibulum orci non tincidunt posuere. Duis tincidunt, odio porta pretium vehicula, quam nibh bibendum sem, ac malesuada lectus lectus et felis. Morbi rhoncus sed quam vitae maximus. Duis volutpat lorem lorem, quis consequat velit mattis pulvinar. Nullam nec arcu non nibh viverra elementum eget tristique est. Donec rutrum urna quis vulputate porttitor. Curabitur gravida tellus non tortor sollicitudin malesuada. Ut ac sem condimentum, congue enim ac, pellentesque urna. Integer bibendum sed nisi ac volutpat.</p>
                |
            """.trimMargin()



private val gridImages = """
                |<p>Картинки</p><script>alert("AAAAAAA")</script>
                |<div style="display: grid; width: fit-content; height: fit-content; grid-template: 100px 100px 100px / 100px 200px 100px; grid-gap: 15px 15px;">
                |<img src="path=NEXT UP.jpg" style="grid-area: 1 / 1 / span 2 / span 2; width: 100%; height: 100%; object-fit: cover;"/>
                |<img src="path=NEXT UP.jpg" style="grid-area: 1 / 3 / span 1 / span 1; width: 100%; height: 100%; object-fit: cover;"/>
                |<img src="path=NEXT UP.jpg" style="grid-area: 2 / 3 / span 1 / span 1; width: 100%; height: 100%; object-fit: cover;"/>
                |<img src="path=NEXT UP.jpg" style="grid-area: 3 / 1 / span 1 / span 1; width: 100%; height: 100%; object-fit: cover;"/>
                |<img src="path=NEXT UP.jpg" style="grid-area: 3 / 2 / span 1 / span 2; width: 100%; height: 100%; object-fit: cover;"/>
                |</div>
""".trimMargin()