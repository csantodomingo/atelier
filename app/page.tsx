import Link from 'next/link';
import { Shirt, Sparkles, Image } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            Atelier
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Not sure what to wear today? You've come to the right place.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Image className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Upload Your Clothes</h3>
            <p className="text-gray-600">
              Take photos of your clothing and we'll automatically identify and categorize each item.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-4">
              <Shirt className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Build Your Wardrobe</h3>
            <p className="text-gray-600">
              Organize your digital wardrobe with all your tops, bottoms, shoes, and accessories.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Generate Outfits</h3>
            <p className="text-gray-600">
              Describe the occasion or vibe, and get perfectly curated outfit suggestions instantly.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/wardrobe"
            className="px-8 py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition text-center"
          >
            Build Your Wardrobe
          </Link>
          <Link
            href="/outfits"
            className="px-8 py-4 bg-white text-purple-600 border-2 border-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition text-center"
          >
            Generate Outfits
          </Link>
        </div>
      </div>
    </div>
  );
}