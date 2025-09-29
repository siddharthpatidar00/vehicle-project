import { Component,AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FAQ {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html'
})
export class FaqComponent implements AfterViewInit {
  faqs: FAQ[] = [
    {
      question: 'What types of construction vehicles do you deal in?',
      answer: 'We handle a wide range of used construction vehicles including excavators, bulldozers, backhoe loaders, cranes, dump trucks, road rollers, and more.'
    },
    {
      question: 'Do you only deal with old/used vehicles?',
      answer: 'Yes, we specialize in pre-owned construction vehicles that are still in good working condition, ensuring affordability without compromising performance.'
    },
    {
      question: 'How do I sell my old construction vehicle?',
      answer: 'You can contact us with your vehicle details, photos, and documents. Our team will inspect the vehicle, agree on a price, and help you complete the sale quickly.'
    },
    {
      question: 'Can I rent a construction vehicle for short-term projects?',
      answer: 'Absolutely. We offer daily, weekly, and monthly rental options to suit your project needs.'
    },
    {
      question: 'How do you ensure the quality of the vehicles?',
      answer: 'All vehicles go through a thorough inspection, servicing, and documentation verification before being sold or rented.'
    },
    {
      question: 'Do you offer delivery for purchased or rented vehicles?',
      answer: 'Yes, delivery services are available at an additional cost depending on your location.'
    },
    {
      question: 'Can I trade my old vehicle for another one?',
      answer: 'Yes, we offer trade-in options where you can exchange your old construction vehicle for another from our stock.'
    },
    {
      question: 'What documents are required to buy or sell a vehicle?',
      answer: 'You’ll need ownership papers, ID proof, and any other relevant documents for legal transfer.'
    },
    {
      question: 'Do you provide financing options?',
      answer: 'Yes, we have tie-ups with financial institutions to provide easy loan facilities for eligible customers.'
    },
    {
      question: 'How can I check the available stock?',
      answer: 'You can visit our yard/showroom or check our updated listings on our website/app.'
    }
  ];

  ngAfterViewInit(): void {
    const text = "Frequently Asked Questions";
    const target = document.getElementById("text")!;
    const consoleEl = document.getElementById("console")!;
    let index = 0;
    let increment = 1;
    let visible = true;

    function typeWriter() {
      target.innerText = text.substring(0, index);
      index += increment;

      if (index === text.length + 1) {
        increment = -1;
        setTimeout(typeWriter, 2000); 
      } else if (index === 0) {
        increment = 1; 
        setTimeout(typeWriter, 1000); 
      } else {
        setTimeout(typeWriter, 120);
      }
    }

    setInterval(() => {
      if (visible) {
        consoleEl.classList.add("opacity-0");
      } else {
        consoleEl.classList.remove("opacity-0");
      }
      visible = !visible;
    }, 400);

    typeWriter();
  }
}
