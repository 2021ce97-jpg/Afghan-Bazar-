import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Store, User, MapPin, UploadCloud, CheckCircle2, Mail } from 'lucide-react';

export default function SellerSignup() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [tazkiraFile, setTazkiraFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTazkiraFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('common.shopSignup')}</h1>
        <p className="text-muted-foreground">Join Kabul's largest local marketplace and grow your business.</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 transition-all" style={{ width: `${((step - 1) / 4) * 100}%` }}></div>
        
        {[
          { icon: User, label: 'Personal' },
          { icon: Store, label: 'Shop Details' },
          { icon: MapPin, label: 'Location' },
          { icon: CheckCircle2, label: 'Verification' },
          { icon: Mail, label: 'Email' }
        ].map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${step > i ? 'bg-primary border-primary text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <span className={`text-xs font-medium ${step > i ? 'text-primary' : 'text-gray-500'}`}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border">
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <Input placeholder="Ahmad" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <Input placeholder="Khan" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number (For OTP)</label>
              <Input placeholder="+93 70 000 0000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input type="email" placeholder="ahmad@example.com" />
            </div>
            <Button className="w-full mt-6" onClick={() => setStep(2)}>Next Step</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="text-xl font-semibold mb-4">Shop Details</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Shop Name</label>
              <Input placeholder="e.g. Kabul Electronics" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option>Fashion & Clothing</option>
                <option>Electronics & Gadgets</option>
                <option>Groceries & Essentials</option>
                <option>Pharmacy & Health</option>
                <option>Beauty & Personal Care</option>
                <option>Home & Kitchen</option>
                <option>Jewelry & Accessories</option>
                <option>Footwear</option>
                <option>Mobile & Accessories</option>
                <option>Furniture & Home Decor</option>
                <option>Toys, Kids & Baby</option>
                <option>Sports & Outdoors</option>
                <option>Afghan Specialties</option>
                <option>Tools & Hardware</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Shop Description</label>
              <textarea className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]" placeholder="Tell customers about your shop..."></textarea>
            </div>
            <div className="flex gap-4 mt-6">
              <Button variant="outline" className="w-full" onClick={() => setStep(1)}>Back</Button>
              <Button className="w-full" onClick={() => setStep(3)}>Next Step</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="text-xl font-semibold mb-4">Location & Delivery</h2>
            <div>
              <label className="block text-sm font-medium mb-1">District (Kabul)</label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option>Shar-e-Naw</option>
                <option>Wazir Akbar Khan</option>
                <option>Macroyan</option>
                <option>Khair Khana</option>
                <option>Dasht-e-Barchi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Delivery Radius (km)</label>
              <input type="range" min="1" max="10" defaultValue="5" className="w-full" />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 km</span>
                <span>5 km</span>
                <span>10 km</span>
              </div>
            </div>
            <div className="bg-gray-100 h-48 rounded-lg border flex items-center justify-center text-gray-500">
              [ Interactive Map Placeholder ]
            </div>
            <div className="flex gap-4 mt-6">
              <Button variant="outline" className="w-full" onClick={() => setStep(2)}>Back</Button>
              <Button className="w-full" onClick={() => setStep(4)}>Next Step</Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 animate-in fade-in">
            <h2 className="text-xl font-semibold mb-4">Verification</h2>
            <p className="text-sm text-gray-600 mb-4">To ensure trust on Bazar.af, we require a scan of your Tazkira (National ID).</p>
            
            <div>
              <label className="block text-sm font-medium mb-1">Tazkira Number</label>
              <Input placeholder="e.g. 123456789" />
            </div>
            
            <div 
              className="border-2 border-dashed rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/jpeg, image/png"
                onChange={handleFileChange}
              />
              {tazkiraFile ? (
                <div className="space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-2" />
                  <p className="font-medium text-green-600">File selected: {tazkiraFile.name}</p>
                  <p className="text-xs text-gray-500 mt-1">Click to change</p>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="font-medium">Click to upload Tazkira Photo</p>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground italic">* Uploaded images will be securely stored in Firebase Storage.</p>

            <div className="flex gap-4 mt-6">
              <Button variant="outline" className="w-full" onClick={() => setStep(3)}>Back</Button>
              <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => setStep(5)}>Submit Application</Button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4 animate-in fade-in text-center py-8">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
            <p className="text-muted-foreground mb-6">
              We've sent a verification link to your email address. Please click the link to confirm your email and complete the signup process.
            </p>
            <Button className="w-full" onClick={() => setStep(6)}>I have verified my email (Simulate)</Button>
            <Button variant="ghost" className="w-full mt-2">Resend Email</Button>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4 animate-in fade-in text-center py-8">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
            <p className="text-muted-foreground mb-6">
              Thank you for applying to join Bazar.af. Your application is currently under review and will be processed shortly. We will contact you via phone or email once your shop is approved.
            </p>
            <Button className="w-full" onClick={() => window.location.href = '/'}>Return to Home</Button>
          </div>
        )}
      </div>
    </div>
  );
}

