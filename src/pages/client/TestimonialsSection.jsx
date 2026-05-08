import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const testimonials = [
  {
    text: "Un voyage de noces magique à Santorini. Chaque détail était pensé, du coucher de soleil en catamaran au restaurant secret avec vue sur la caldeira. Merci Imani Travel Planner !",
    name: 'Camille & Thomas',
  },
  {
    text: "Un séjour au Japon incroyable. Temples cachés, ryokans authentiques, ramen dans les ruelles de Shinjuku. Je recommande les yeux fermés !",
    name: 'Marc L.',
  },
  {
    text: "Des activités hors des sentiers battus en Toscane. Cours de cuisine chez une nonna, dégustation privée dans un vignoble familial. Mention spéciale !",
    name: 'Léa & ses amies',
  },
  {
    text: "Solo en Égypte, j'avais peur des arnaques. Grâce aux conseils d'Imani Travel Planner, j'ai visité les pyramides en toute sérénité et découvert des oasis secrètes.",
    name: 'Aminata D.',
  },
  {
    text: "Week-end surprise pour les 30 ans de ma femme à Marrakech. Riad de rêve, dîner dans le désert, balade en montgolfière au lever du soleil. Elle a adoré !",
    name: 'Karim B.',
  },
  {
    text: "En famille à Bali avec 3 enfants. On pensait que c'était compliqué, mais tout était organisé parfaitement : rizières, temples, plage et spa !",
    name: 'Famille Dupont',
  },
  {
    text: "Safari au Kenya entre amis. Réservation de lodges exceptionnels, guide francophone, coucher de soleil sur la savane. Le voyage de nos vies !",
    name: 'Julie & la bande',
  }
]

export default function TestimonialsSection() {
  return (
    <section className="section testimonials-section" id="testimonials">
      <div className="container">
        <div data-aos="fade-up" style={{ textAlign: 'center' }}>
          <span className="section-tag" style={{ margin: '0 auto' }}><i className="fas fa-heart"></i> Témoignages</span>
          <h2 className="section-title">Ce que nos <span style={{ color: 'var(--rose-accent)' }}>voyageurs</span> racontent</h2>
          <p className="section-desc" style={{ margin: '0 auto' }}>Des expériences uniques, vécues et partagées.</p>
        </div>
        <div className="swiper testimonials-swiper" data-aos="fade-up">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              992: { slidesPerView: 3 }
            }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop={true}
          >
            <div className="swiper-wrapper">
              {testimonials.map((testimonial, index) => (
                <SwiperSlide key={index}>
                  <div className="testimonial-card">
                    <div className="testimonial-quote">"</div>
                    <p style={{ fontStyle: 'italic' }}>{testimonial.text}</p>
                    <strong>{testimonial.name}</strong>
                    <div className="testimonial-stars">★★★★★</div>
                  </div>
                </SwiperSlide>
              ))}
            </div>
          </Swiper>
          <div className="swiper-pagination"></div>
        </div>
      </div>
    </section>
  )
}
