
export const GatheringSection = () => {
    return (
        <section className="py-20 bg-muted/30 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12 animate-fade-in">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            JSHA 제 9차 집담회
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            치열했던 배움의 현장, 그 뜨거운 열기를 전합니다
                        </p>
                    </div>

                    <div className="relative rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-700 border border-border bg-background">
                        {/* Browser Window Header */}
                        <div className="h-8 bg-muted border-b border-border flex items-center px-4 gap-2">

                        </div>
                        {/* Image Content */}
                        <img
                            src="/images/jsha_9th_gathering.jpg"
                            alt="JSHA 제 9차 집담회 현장"
                            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};
