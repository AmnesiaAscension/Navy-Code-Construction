import { GoogleGenAI } from "@google/genai";

/**
 * Navy Code Construction - Interactive Logic
 * This file handles all DOM interactions, animations, and the Gemini AI Assistant.
 */

// Initialize Lucide icons
// @ts-ignore
lucide.createIcons();

// --- Navbar Interaction ---
const navbar = document.getElementById('navbar');
const logoIcon = document.getElementById('logo-icon');
const logoText = document.getElementById('logo-text');
const logoSub = document.getElementById('logo-sub');
const navLinks = document.querySelectorAll('.nav-link');
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        navbar?.classList.add('glass-nav', 'py-4', 'shadow-lg');
        navbar?.classList.remove('py-6');
        logoIcon?.classList.add('bg-blue-900', 'text-white');
        logoIcon?.classList.remove('bg-white', 'text-blue-900');
        logoText?.classList.add('text-blue-900');
        logoText?.classList.remove('text-white');
        logoSub?.classList.add('text-red-600');
        logoSub?.classList.remove('text-red-400');
        navLinks.forEach(link => {
            link.classList.add('text-gray-800');
            link.classList.remove('text-white');
        });
        menuBtn?.classList.remove('text-white');
        menuBtn?.classList.add('text-blue-900');
    } else {
        navbar?.classList.remove('glass-nav', 'py-4', 'shadow-lg');
        navbar?.classList.add('py-6');
        logoIcon?.classList.remove('bg-blue-900', 'text-white');
        logoIcon?.classList.add('bg-white', 'text-blue-900');
        logoText?.classList.remove('text-blue-900');
        logoText?.classList.add('text-white');
        logoSub?.classList.remove('text-red-600');
        logoSub?.classList.add('text-red-400');
        navLinks.forEach(link => {
            link.classList.remove('text-gray-800');
            link.classList.add('text-white');
        });
        menuBtn?.classList.add('text-white');
        menuBtn?.classList.remove('text-blue-900');
    }
});

menuBtn?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('hidden');
});

// --- Lead Form Logic ---
const contactForm = document.getElementById('contact-form') as HTMLFormElement;
const successMsg = document.getElementById('success-msg');

contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    contactForm.classList.add('hidden');
    successMsg?.classList.remove('hidden');
    
    // Simulate analytic tracking or API relay
    console.log("Lead captured. Deployment in progress...");
});

// --- AI Gemini Assistant Logic ---
const chatToggle = document.getElementById('chat-toggle');
const chatClose = document.getElementById('chat-close');
const chatWindow = document.getElementById('chat-window');
const chatForm = document.getElementById('chat-form') as HTMLFormElement;
const chatInput = document.getElementById('chat-input') as HTMLInputElement;
const chatMessages = document.getElementById('chat-messages');
const chatLoading = document.getElementById('chat-loading');

// Initialize Gemini API
// @ts-ignore
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

chatToggle?.addEventListener('click', () => {
    chatWindow?.classList.remove('hidden');
    chatToggle?.classList.add('hidden');
});

chatClose?.addEventListener('click', () => {
    chatWindow?.classList.add('hidden');
    chatToggle?.classList.remove('hidden');
});

const addMessage = (role: 'user' | 'bot', text: string) => {
    const div = document.createElement('div');
    div.className = `flex ${role === 'user' ? 'justify-end' : 'justify-start'}`;
    
    const bubble = document.createElement('div');
    bubble.className = `max-w-[85%] p-4 rounded-3xl text-sm font-medium shadow-sm leading-relaxed ${
        role === 'user' 
            ? 'bg-blue-900 text-white rounded-tr-none' 
            : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
    }`;
    bubble.innerText = text;
    
    div.appendChild(bubble);
    chatMessages?.appendChild(div);
    if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
};

chatForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const prompt = chatInput.value.trim();
    if (!prompt) return;

    // Clear input and show user message
    chatInput.value = '';
    addMessage('user', prompt);
    chatLoading?.classList.remove('hidden');

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Role: You are the AI Project Estimator for Navy Code Construction, a professional veteran-owned company. 
            Tone: Professional, disciplined, helpful, and military-inspired (e.g., 'Roger that', 'On mission').
            Context: We build high-quality decks, pergolas, and home renovations in Texas City.
            Question: ${prompt}
            Instructions: Provide a concise, high-value answer. Suggest 2 material considerations or Texas-specific tips. Always encourage them to book a free site visit by calling (409) 239-9673.`,
            config: {
                maxOutputTokens: 250,
                temperature: 0.7,
            }
        });

        const botResponse = response.text || "Apologies, signal dropped. Please call us at (409) 239-9673 for a direct estimate.";
        addMessage('bot', botResponse);
    } catch (error) {
        console.error("AI Error:", error);
        addMessage('bot', "The AI is currently off-grid. Please reach out to HQ directly at (409) 239-9673 for a quote.");
    } finally {
        chatLoading?.classList.add('hidden');
    }
});
