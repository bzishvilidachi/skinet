import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { SlickCarouselModule } from 'ngx-slick-carousel';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    RouterModule,
    SlickCarouselModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent   {
  slides = [
    { img: '/images/hero1.jpg', title: 'Welcome to SkiNet!' },
    { img: '/images/hero2.jpg', title: 'Gear Up for Adventure!' },
    { img: '/images/hero3.jpg', title: 'Explore New Heights!' }
  ];
  
  
  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, 
    autoplaySpeed: 4000,
    speed: 800, 
    arrows: true,
    dots: true,
    infinite: true, 
    centerMode: false, 
    adaptiveHeight: false, 
    swipeToSlide: true,
    responsive: [], 
  };
  
  
  
  
}



