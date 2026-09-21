import GeneratorPage from '../components/GeneratorPage.jsx'

const examples = [
  { label: 'Minimalist basics', text: 'A minimalist womenswear brand offering timeless, sustainable basics made from organic cotton for urban professionals' },
  { label: 'Limited drop streetwear', text: 'A high-end streetwear label releasing monthly limited drops targeting Gen Z sneakerheads and culture makers in major cities' },
  { label: 'Luxury leather goods', text: 'A luxury leather goods brand selling handcrafted bags and accessories to discerning shoppers who value heritage craftsmanship over trends' },
  { label: 'Size-inclusive activewear', text: 'A size-inclusive activewear brand empowering women of all body types with bold, functional performance wear designed for everyday movement' },
]

export default function FashionPage() {
  return <GeneratorPage kind="fashion" examples={examples} />
}
