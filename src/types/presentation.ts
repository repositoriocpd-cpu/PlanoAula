export type SlideType = 'title' | 'bullets' | 'image_caption' | 'two_columns' | 'summary';

export interface Slide {
    type: SlideType;
    headline: string;
    subheadline?: string;
    bullets?: string[];
    image_url?: string;
    caption?: string;
    column_left?: string[];
    column_right?: string[];
}

export type PresentationTheme = 'clean-modern' | 'kids-colorful' | 'institutional';

export interface Presentation {
    id?: string;
    user_id?: string;
    title: string;
    grade: string;
    discipline: string;
    theme: PresentationTheme;
    duration_minutes: 5 | 10 | 15;
    content_json: {
        title: string;
        audience: string;
        theme: string;
        slides: Slide[];
    };
    created_at?: string;
}
