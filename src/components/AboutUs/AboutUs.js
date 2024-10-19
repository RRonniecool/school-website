import React from 'react';
import './aboutus.css'
import about1 from '../../images/about1.jpg'
import about3 from '../../images/about3.jpg'
import primary from '../../images/primary.jpg'
import nursery from '../../images/nursery.jpg'
import principal from '../../images/principal.jpg'
import about2 from '../../images/about2.jpg'

const aboutUsData = [
    {
        title: 'Our Teachers',
        description: 'We are proud of the caliber of teaching staff we engage. They intelligently deliver the value we design through our curriculum and courses. They are well trained with great experience to ensure that relevant knowledge is passed on to your Wards.',
        imgSrc: about1
    },
    {
        title: 'Our Curriculum',
        description: 'With the support of the Federal Ministry of Education, we ensure that our curriculum and courses address the key areas that a quality secondary education should cover. We expose every child to subject areas within the required and approved scope. Our courses center around; Mathematics and Sciences, Humanities, Trade, Technology and languages.',
        imgSrc: about2
    },
    {
        title: 'Extracurricular',
        description: 'We are keen about the all round development of your Wards. We make sure they are well equipped physically, emotionally and psychologically to take on life. We include activities in the holistic education plan such as; Speech and prize giving , recreation, literary and art, debate competitions, quiz competitions, Inter-house sports and excursions.',
        imgSrc: about3
    },
    {
        title: 'Nursery School',
        description: 'Our Nursery School provides a caring and stimulating environment where our youngest learners begin their educational journey. With a focus on early childhood development, we nurture their curiosity and creativity through hands-on activities, interactive play, and guided learning. Our dedicated teachers ensure that children develop foundational skills in literacy, numeracy, and social interaction, all within a safe and loving environment.',
        imgSrc: nursery
    },
    {
        title: 'Primary School',
        description: 'At Jesus Children School, our Primary School program builds upon the foundation set in the early years, offering a well-rounded curriculum that promotes academic excellence, creativity, and character development. Our pupils are encouraged to explore their potential in Mathematics, Science, Humanities, and the Arts. Through engaging lessons, collaborative projects, and extracurricular activities, we instill a love of learning and prepare students to excel academically and personally.',
        imgSrc: primary
    }
]

const AboutUs = () =>{
    return(
        <div className='container' id='about-us'>
            <div className='about-message'>
                <h2>About <span>Us</span> </h2>
                <p>Quality Education For Your Children</p>
                    <div className='cards-container'>
                        {aboutUsData.map(({title,description,imgSrc}, index) => (
                               <div className='about-card' key={index}>
                               <img src={imgSrc} alt={title} className='about-img'/>
                               <h3>{title}</h3>
                               <p>{description}</p>
                           </div>
                        ))}
                    
                    </div>
            </div>

            <div className='principal-message'>
                <div>
                    <img src={principal} alt="Principal" />
                </div>
                <div>
                    <h3>A Welcome Address</h3>
                    <h3>From The Principal</h3>
                    <p>I am honored to serve as the Principal of Jesus Children School, Owerri, a place dedicated to providing a nurturing and impactful learning experience. Our school fosters lifelong learning, helping students grow into successful and morally sound individuals. We are committed to offering an environment where students thrive academically and personally, supported by a team of dedicated teachers who work tirelessly to achieve outstanding results.

                    At Jesus Children School, we embrace diversity and unity, welcoming students from various backgrounds. I encourage all our students to stay motivated and make the most of the opportunities available here. Together, we aim for excellence. Welcome to a journey of growth and achievement. God bless you.</p>
                </div>

            </div>

        </div>
    )
}

export default AboutUs;