import { MapPin, Phone, User } from "lucide-react";
import { ReferralHospital } from "@/data/referralHospitals";

interface ReferralHospitalCardProps {
    hospital: ReferralHospital;
}

export function ReferralHospitalCard({ hospital }: ReferralHospitalCardProps) {
    return (
        <div className="flex-shrink-0 w-80 bg-card border-2 border-border rounded-2xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
            <div className="mb-4 flex items-center justify-center h-32 bg-white rounded-lg p-2 border border-gray-100">
                <img
                    src={hospital.logo}
                    alt={`${hospital.name} 로고`}
                    className="max-h-full max-w-full object-contain"
                />
            </div>

            <div className="mb-4">
                <h3 className="text-xl font-bold mb-2">{hospital.name}</h3>
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                    {hospital.location}
                </span>
            </div>

            <div className="space-y-3 text-sm mt-auto">
                <div className="flex items-start gap-2">
                    <User className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground font-medium">{hospital.director}</span>
                </div>
                <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{hospital.address}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <a href={`tel:${hospital.phone}`} className="text-muted-foreground hover:text-primary transition-colors">
                        {hospital.phone}
                    </a>
                </div>
            </div>
        </div>
    );
}
