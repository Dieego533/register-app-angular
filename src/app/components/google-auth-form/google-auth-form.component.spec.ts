import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleAuthFormComponent } from './google-auth-form.component';

describe('GoogleAuthFormComponent', () => {
  let component: GoogleAuthFormComponent;
  let fixture: ComponentFixture<GoogleAuthFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GoogleAuthFormComponent]
    });
    fixture = TestBed.createComponent(GoogleAuthFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
